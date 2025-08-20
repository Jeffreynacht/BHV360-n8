export default function SimpleTestPage() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🎉 BHV360 WERKT!</h1>
      <p>Als je dit ziet, werkt je deployment!</p>
      <p>Tijd: {new Date().toLocaleString()}</p>
      <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
        Terug naar homepage
      </a>
    </div>
  )
}
