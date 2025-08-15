export interface PTTSession {
  id: string
  userId: string
  userName: string
  channelId: string
  isActive: boolean
  startTime: string
  endTime?: string
  audioUrl?: string
  transcription?: string
  priority: "low" | "normal" | "high" | "emergency"
}

export interface PTTChannel {
  id: string
  name: string
  description: string
  participants: string[]
  isEmergencyChannel: boolean
  isActive: boolean
  currentSpeaker?: string
  lastActivity: string
}

export interface VoiceCommand {
  command: string
  action: string
  parameters?: Record<string, any>
  confidence: number
}

export class HandsFreePTTService {
  private mediaRecorder: MediaRecorder | null = null
  private audioStream: MediaStream | null = null
  private isRecording = false
  private isListening = false
  private currentSession: PTTSession | null = null
  private channels: PTTChannel[] = []
  private voiceActivationEnabled = false
  private speechRecognition: any = null

  constructor() {
    this.initializeSpeechRecognition()
    this.initializeChannels()
  }

  // Initialize speech recognition for voice commands
  private initializeSpeechRecognition(): void {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      this.speechRecognition = new SpeechRecognition()

      this.speechRecognition.continuous = true
      this.speechRecognition.interimResults = true
      this.speechRecognition.lang = "nl-NL"

      this.speechRecognition.onresult = (event: any) => {
        this.handleSpeechResult(event)
      }

      this.speechRecognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
      }
    }
  }

  // Start hands-free mode
  async startHandsFreeMode(): Promise<boolean> {
    try {
      // Request microphone permission
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Start voice activation detection
      this.voiceActivationEnabled = true
      this.startVoiceActivationDetection()

      // Start speech recognition for commands
      if (this.speechRecognition) {
        this.speechRecognition.start()
        this.isListening = true
      }

      return true
    } catch (error) {
      console.error("Failed to start hands-free mode:", error)
      return false
    }
  }

  // Stop hands-free mode
  stopHandsFreeMode(): void {
    this.voiceActivationEnabled = false
    this.isListening = false

    if (this.speechRecognition) {
      this.speechRecognition.stop()
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop())
      this.audioStream = null
    }

    if (this.isRecording) {
      this.stopRecording()
    }
  }

  // Voice activation detection using audio analysis
  private startVoiceActivationDetection(): void {
    if (!this.audioStream) return

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(this.audioStream)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    microphone.connect(analyser)

    const checkAudioLevel = () => {
      if (!this.voiceActivationEnabled) return

      analyser.getByteFrequencyData(dataArray)

      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength

      // Voice activation threshold
      const threshold = 30

      if (average > threshold && !this.isRecording) {
        this.startRecording("voice-activated")
      } else if (average <= threshold && this.isRecording) {
        // Stop recording after silence
        setTimeout(() => {
          if (this.isRecording) {
            this.stopRecording()
          }
        }, 1000) // 1 second of silence
      }

      requestAnimationFrame(checkAudioLevel)
    }

    checkAudioLevel()
  }

  // Handle speech recognition results
  private handleSpeechResult(event: any): void {
    const results = event.results
    const lastResult = results[results.length - 1]

    if (lastResult.isFinal) {
      const transcript = lastResult[0].transcript.toLowerCase().trim()
      const voiceCommand = this.parseVoiceCommand(transcript)

      if (voiceCommand) {
        this.executeVoiceCommand(voiceCommand)
      }
    }
  }

  // Parse voice commands
  private parseVoiceCommand(transcript: string): VoiceCommand | null {
    const commands = [
      {
        patterns: ["alarm", "noodgeval", "emergency"],
        action: "trigger_alarm",
        confidence: 0.9,
      },
      {
        patterns: ["brand", "fire"],
        action: "trigger_fire_alarm",
        confidence: 0.9,
      },
      {
        patterns: ["ehbo", "medical", "medisch"],
        action: "trigger_medical_alarm",
        confidence: 0.9,
      },
      {
        patterns: ["evacuatie", "evacuation", "ontruiming"],
        action: "trigger_evacuation",
        confidence: 0.9,
      },
      {
        patterns: ["status", "situatie"],
        action: "request_status",
        confidence: 0.8,
      },
      {
        patterns: ["help", "hulp"],
        action: "request_help",
        confidence: 0.8,
      },
    ]

    for (const command of commands) {
      for (const pattern of command.patterns) {
        if (transcript.includes(pattern)) {
          return {
            command: transcript,
            action: command.action,
            confidence: command.confidence,
          }
        }
      }
    }

    return null
  }

  // Execute voice commands
  private async executeVoiceCommand(voiceCommand: VoiceCommand): Promise<void> {
    console.log("Executing voice command:", voiceCommand)

    switch (voiceCommand.action) {
      case "trigger_alarm":
        await this.triggerEmergencyAlarm("general")
        break
      case "trigger_fire_alarm":
        await this.triggerEmergencyAlarm("fire")
        break
      case "trigger_medical_alarm":
        await this.triggerEmergencyAlarm("medical")
        break
      case "trigger_evacuation":
        await this.triggerEmergencyAlarm("evacuation")
        break
      case "request_status":
        await this.requestStatus()
        break
      case "request_help":
        await this.requestHelp()
        break
    }
  }

  // Start PTT recording
  async startRecording(trigger: "manual" | "voice-activated" | "emergency" = "manual"): Promise<void> {
    if (!this.audioStream || this.isRecording) return

    try {
      this.mediaRecorder = new MediaRecorder(this.audioStream)
      const audioChunks: Blob[] = []

      this.mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        await this.processPTTRecording(audioBlob, trigger)
      }

      this.mediaRecorder.start()
      this.isRecording = true

      // Create PTT session
      this.currentSession = {
        id: `ptt-${Date.now()}`,
        userId: "current-user",
        userName: "Current User",
        channelId: "emergency",
        isActive: true,
        startTime: new Date().toISOString(),
        priority: trigger === "emergency" ? "emergency" : "normal",
      }
    } catch (error) {
      console.error("Failed to start recording:", error)
    }
  }

  // Stop PTT recording
  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop()
      this.isRecording = false

      if (this.currentSession) {
        this.currentSession.endTime = new Date().toISOString()
        this.currentSession.isActive = false
      }
    }
  }

  // Process PTT recording
  private async processPTTRecording(audioBlob: Blob, trigger: string): Promise<void> {
    try {
      // Upload audio to server
      const formData = new FormData()
      formData.append("audio", audioBlob)
      formData.append("sessionId", this.currentSession?.id || "")
      formData.append("trigger", trigger)

      const response = await fetch("/api/ptt/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (this.currentSession) {
        this.currentSession.audioUrl = result.audioUrl
        this.currentSession.transcription = result.transcription
      }

      // Broadcast to channel participants
      await this.broadcastPTTMessage(this.currentSession!)
    } catch (error) {
      console.error("Failed to process PTT recording:", error)
    }
  }

  // Broadcast PTT message to channel
  private async broadcastPTTMessage(session: PTTSession): Promise<void> {
    await fetch("/api/ptt/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    })
  }

  // Emergency alarm triggers
  private async triggerEmergencyAlarm(type: string): Promise<void> {
    await fetch("/api/emergency/voice-trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        triggeredBy: "voice-command",
        timestamp: new Date().toISOString(),
        location: "current-location", // Would get from positioning service
      }),
    })
  }

  private async requestStatus(): Promise<void> {
    // Request current emergency status
    const response = await fetch("/api/emergency/status")
    const status = await response.json()

    // Convert to speech
    this.speakText(`Huidige status: ${status.message}`)
  }

  private async requestHelp(): Promise<void> {
    await fetch("/api/emergency/help-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestedBy: "voice-command",
        timestamp: new Date().toISOString(),
        location: "current-location",
      }),
    })

    this.speakText("Hulpverzoek is verzonden naar het BHV team")
  }

  // Text-to-speech for feedback
  private speakText(text: string): void {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "nl-NL"
      utterance.rate = 1.0
      utterance.pitch = 1.0
      speechSynthesis.speak(utterance)
    }
  }

  // Initialize default channels
  private initializeChannels(): void {
    this.channels = [
      {
        id: "emergency",
        name: "Noodkanaal",
        description: "Hoofdkanaal voor noodsituaties",
        participants: [],
        isEmergencyChannel: true,
        isActive: true,
        lastActivity: new Date().toISOString(),
      },
      {
        id: "coordination",
        name: "Coördinatie",
        description: "Kanaal voor BHV coördinatie",
        participants: [],
        isEmergencyChannel: false,
        isActive: true,
        lastActivity: new Date().toISOString(),
      },
      {
        id: "medical",
        name: "EHBO",
        description: "Kanaal voor medische noodsituaties",
        participants: [],
        isEmergencyChannel: true,
        isActive: true,
        lastActivity: new Date().toISOString(),
      },
    ]
  }

  // Get PTT status
  getStatus(): {
    isHandsFreeActive: boolean
    isRecording: boolean
    isListening: boolean
    currentSession: PTTSession | null
    channels: PTTChannel[]
  } {
    return {
      isHandsFreeActive: this.voiceActivationEnabled,
      isRecording: this.isRecording,
      isListening: this.isListening,
      currentSession: this.currentSession,
      channels: this.channels,
    }
  }
}
