"""
API_ISLAM - Main FastAPI Application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from app.routers import quran, adhkar, hadith, prayer_times, mushaf, tafsir, qibla, hijri, radios

app = FastAPI(
    title="API_ISLAM",
    description="Comprehensive Islamic API providing Holy Quran, Printed Mushafs (Hafs, Warsh, Qalun, Tajweed), Authentic Hadiths, Tafsir, Qibla Direction, Hijri Calendar, Live Radios, Daily Adhkar, and Astronomical Prayer Times.",
    version="2.2.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for cross-origin frontend/mobile app requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(quran.router)
app.include_router(mushaf.router)
app.include_router(tafsir.router)
app.include_router(adhkar.router)
app.include_router(hadith.router)
app.include_router(prayer_times.router)
app.include_router(qibla.router)
app.include_router(hijri.router)
app.include_router(radios.router)

@app.get("/", response_class=HTMLResponse, tags=["General"])
def root():
    return """
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API_ISLAM - بوابة البيانات الإسلامية</title>
        <style>
            :root {
                --primary: #059669;
                --primary-dark: #065f46;
                --bg: #0f172a;
                --card-bg: #1e293b;
                --text: #f8fafc;
                --text-muted: #94a3b8;
                --accent: #38bdf8;
            }
            body {
                margin: 0;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: var(--bg);
                color: var(--text);
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
            }
            .card {
                background-color: var(--card-bg);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 40px;
                max-width: 650px;
                width: 100%;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            }
            h1 {
                color: var(--primary);
                font-size: 2.2rem;
                margin-bottom: 8px;
            }
            p.lead {
                color: var(--text-muted);
                font-size: 1.1rem;
                margin-bottom: 30px;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-bottom: 30px;
                text-align: right;
            }
            .grid-item {
                background: rgba(255,255,255,0.03);
                padding: 15px;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.05);
            }
            .grid-item h3 {
                margin: 0 0 5px 0;
                font-size: 1rem;
                color: var(--accent);
            }
            .grid-item p {
                margin: 0;
                font-size: 0.85rem;
                color: var(--text-muted);
            }
            .actions {
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            a.btn {
                display: inline-block;
                padding: 12px 24px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 600;
                transition: transform 0.2s, background-color 0.2s;
            }
            .btn-primary {
                background-color: var(--primary);
                color: white;
            }
            .btn-primary:hover {
                background-color: var(--primary-dark);
                transform: translateY(-2px);
            }
            .btn-secondary {
                background-color: rgba(255,255,255,0.1);
                color: var(--text);
            }
            .btn-secondary:hover {
                background-color: rgba(255,255,255,0.2);
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>🌿 API_ISLAM v2.1</h1>
            <p class="lead">خدمة وواجهة برمجية متكاملة للقرآن الكريم، المصاحف المصورة، كتب التفسير، الأحاديث، الأذكار ومواقيت الصلاة.</p>
            <div class="grid">
                <div class="grid-item">
                    <h3>📖 القرآن والروايات</h3>
                    <p>حفص، ورش، قالون، القراءات العشر وتلاوات بأصوات المشاهير.</p>
                </div>
                <div class="grid-item">
                    <h3>🖼️ المصاحف الورقية</h3>
                    <p>مصحف المدينة، التجويد الملون، الشمرلي، صفحات عالية الدقة.</p>
                </div>
                <div class="grid-item">
                    <h3>📚 كتب التفاسير</h3>
                    <p>الميسر، السعدي، ابن كثير، القرطبي، الطبري، الجلالين.</p>
                </div>
                <div class="grid-item">
                    <h3>🕌 مواقيت الصلاة والأذكار</h3>
                    <p>حساب فلكي دقيق حسب الإحداثيات وأذكار المسلم اليومية.</p>
                </div>
            </div>
            <div class="actions">
                <a href="/docs" class="btn btn-primary">📘 التوثيق التفاعلي (Swagger UI)</a>
                <a href="/redoc" class="btn btn-secondary">📑 ReDoc</a>
            </div>
        </div>
    </body>
    </html>
    """

@app.get("/health", tags=["General"])
def health_check():
    return {"status": "healthy", "service": "API_ISLAM", "version": "2.2.0"}
