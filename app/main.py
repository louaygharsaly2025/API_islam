"""
API_ISLAM - Main FastAPI Application.
Enterprise-grade Islamic REST API & Data Engine.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.routers import (
    quran,
    tajweed,
    mushaf,
    tafsir,
    asmaul_husna,
    duas,
    hadith,
    adhkar,
    prayer_times,
    qibla,
    hijri,
    zakat,
    radios
)

app = FastAPI(
    title="API_ISLAM (v4.0 Quran Ultimate)",
    description="Comprehensive Islamic REST API with 9 authentic Quran Qira'at (King Fahd Complex), Tajweed Rule Annotations, Printed Mushaf 604 High-Res Pages, Hadith, Tafsir, Adhkar, Prayer Times, Qibla, and Zakat.",
    version="4.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for cross-origin frontend/mobile app requests (Flutter, React Native, iOS, Web)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files (Fonts, CSS, High-Res Page Images)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Register Routers
app.include_router(quran.router)
app.include_router(tajweed.router)
app.include_router(mushaf.router)
app.include_router(tafsir.router)
app.include_router(asmaul_husna.router)
app.include_router(duas.router)
app.include_router(hadith.router)
app.include_router(adhkar.router)
app.include_router(prayer_times.router)
app.include_router(qibla.router)
app.include_router(hijri.router)
app.include_router(zakat.router)
app.include_router(radios.router)


@app.get("/health", tags=["General"])
def health_check():
    return {
        "status": "healthy",
        "service": "API_ISLAM",
        "version": "4.0.0"
    }


@app.get("/", response_class=HTMLResponse, tags=["General"])
def root():
    return """
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API_ISLAM - البوابة الشاملة للقرآن الكريم والبيانات الإسلامية</title>
        <link rel="stylesheet" href="/static/fonts/kfgqpc.local.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #10b981;
                --primary-glow: rgba(16, 185, 129, 0.3);
                --bg-main: #0b0f19;
                --bg-card: #111827;
                --bg-card-hover: #1f2937;
                --text: #f3f4f6;
                --text-muted: #9ca3af;
                --border: rgba(255, 255, 255, 0.08);
                --accent: #38bdf8;
                --gold: #f59e0b;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: 'Cairo', sans-serif;
                background-color: var(--bg-main);
                color: var(--text);
                min-height: 100vh;
                line-height: 1.6;
                padding-bottom: 50px;
            }
            header {
                background: linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(11, 15, 25, 0) 100%);
                padding: 50px 20px 30px;
                text-align: center;
                border-bottom: 1px solid var(--border);
            }
            .badge {
                display: inline-block;
                background: rgba(16, 185, 129, 0.15);
                color: var(--primary);
                border: 1px solid var(--primary);
                padding: 4px 16px;
                border-radius: 50px;
                font-size: 0.85rem;
                font-weight: 700;
                margin-bottom: 15px;
            }
            h1 {
                font-size: 2.5rem;
                font-weight: 900;
                color: #ffffff;
                margin-bottom: 10px;
            }
            h1 span { color: var(--primary); }
            p.lead {
                color: var(--text-muted);
                font-size: 1.15rem;
                max-width: 750px;
                margin: 0 auto 25px;
            }
            .btn-group {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .btn {
                padding: 12px 28px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 700;
                font-size: 1rem;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .btn-primary {
                background: var(--primary);
                color: #064e3b;
                box-shadow: 0 4px 20px var(--primary-glow);
            }
            .btn-primary:hover { background: #059669; color: #ffffff; transform: translateY(-2px); }
            .btn-secondary {
                background: rgba(255, 255, 255, 0.05);
                color: var(--text);
                border: 1px solid var(--border);
            }
            .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }

            .container {
                max-width: 1200px;
                margin: 40px auto 0;
                padding: 0 20px;
            }

            .section-title {
                font-size: 1.6rem;
                font-weight: 700;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .section-title::before {
                content: '';
                display: inline-block;
                width: 6px;
                height: 24px;
                background: var(--primary);
                border-radius: 3px;
            }

            .grid-cards {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }
            .card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 16px;
                padding: 24px;
                transition: all 0.2s ease;
            }
            .card:hover {
                border-color: rgba(16, 185, 129, 0.4);
                background: var(--bg-card-hover);
                transform: translateY(-3px);
            }
            .card-icon {
                font-size: 2rem;
                margin-bottom: 12px;
            }
            .card-title {
                font-size: 1.2rem;
                font-weight: 700;
                margin-bottom: 8px;
                color: #fff;
            }
            .card-desc {
                font-size: 0.9rem;
                color: var(--text-muted);
                margin-bottom: 15px;
            }
            .card-link {
                color: var(--accent);
                text-decoration: none;
                font-weight: 600;
                font-size: 0.85rem;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            .card-link:hover { text-decoration: underline; }

            .demo-section {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 40px;
            }
            .quran-box {
                background: #0b0f19;
                border: 1px solid rgba(245, 158, 11, 0.3);
                border-radius: 16px;
                padding: 30px;
                text-align: center;
                margin-top: 20px;
            }
            .quran-text {
                font-family: 'hafs18', 'Amiri', serif;
                font-size: 2.2rem;
                line-height: 2.2;
                color: #fef3c7;
            }
            .tajweed-demo span {
                cursor: pointer;
                transition: opacity 0.2s;
            }
            .tajweed-demo span:hover { opacity: 0.8; }
            .legend {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
            }
            .legend-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.85rem;
                background: rgba(255, 255, 255, 0.05);
                padding: 4px 10px;
                border-radius: 6px;
            }
            .dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
            }

            footer {
                text-align: center;
                padding-top: 40px;
                color: var(--text-muted);
                font-size: 0.9rem;
                border-top: 1px solid var(--border);
                margin-top: 40px;
            }
        </style>
    </head>
    <body>
        <header>
            <div class="badge">🚀 v4.0 Ultimate Quran Engine</div>
            <h1>API_ISLAM <span>المصحف الشريف</span></h1>
            <p class="lead">محرك وواجهة برمجية متكاملة لبيانات القرآن الكريم برواياته الـ 9 الرسمية (مجمع الملك فهد)، محرك التجويد الملون، صور المصحف 604 صفحة بدقة فائقة، والخدمات الإسلامية.</p>
            <div class="btn-group">
                <a href="/docs" class="btn btn-primary">📖 استكشاف الـ Swagger Docs</a>
                <a href="/redoc" class="btn btn-secondary">📑 توثيق ReDoc</a>
                <a href="/api/v1/quran/surahs" class="btn btn-secondary" target="_blank">📋 قائمة السور الـ 114</a>
                <a href="/api/v1/mushaf/page/1/image" class="btn btn-secondary" target="_blank">🖼️ صورة الصفحة 1</a>
            </div>
        </header>

        <main class="container">
            <!-- Quran & Tajweed Live Demo -->
            <section class="demo-section">
                <h2 class="section-title">✨ تجربة مباشرة: التجويد الملون والرسم العثماني</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">
                    يتم تلوين أحكام التجويد تلقائياً استناداً لمصفوفة الأحكام بدقة الحرف عبر Endpoint <code>/api/v1/tajweed/ayah/1/1/html</code>
                </p>
                <div class="quran-box">
                    <div class="quran-text tajweed-demo">
                        <span style="color: #9ca3af;" title="همزة وصل">بِ</span>سۡمِ <span style="color: #9ca3af;" title="همزة وصل">ٱ</span>للَّهِ <span style="color: #9ca3af;" title="همزة وصل">ٱ</span><span style="color: #9ca3af;" title="لام شمسية">ل</span>رَّحۡمَٰ<span style="color: #ea580c;" title="مد طبيعي">نِ</span> <span style="color: #9ca3af;" title="همزة وصل">ٱ</span><span style="color: #9ca3af;" title="لام شمسية">ل</span>رَّحِ<span style="color: #f59e0b;" title="مد عارض للسكون">ي</span>مِ <span style="color: var(--gold); font-size: 1.5rem;">١</span>
                    </div>
                </div>
                <div class="legend">
                    <div class="legend-item"><div class="dot" style="background: #dc2626;"></div> مد متصل/لازم (أحمر)</div>
                    <div class="legend-item"><div class="dot" style="background: #ea580c;"></div> مد طبيعي/منفصل (برتقالي)</div>
                    <div class="legend-item"><div class="dot" style="background: #16a34a;"></div> غنة وإدغام (أخضر)</div>
                    <div class="legend-item"><div class="dot" style="background: #059669;"></div> إخفاء حقيقي (زمردي)</div>
                    <div class="legend-item"><div class="dot" style="background: #2563eb;"></div> قلقلة وإقلاب (أزرق)</div>
                    <div class="legend-item"><div class="dot" style="background: #9ca3af;"></div> لا يلفظ / وصل (رمادي)</div>
                </div>
            </section>

            <!-- API Modules Grid -->
            <h2 class="section-title">📚 وحدات وخدمات الـ API المتاحة</h2>
            <div class="grid-cards">
                <div class="card">
                    <div class="card-icon">📖</div>
                    <div class="card-title">نصوص القرآن والروايات</div>
                    <div class="card-desc">نصوص كاملة لـ 9 روايات (حفص، ورش، قالون، شعبة، الدوري، السوسي، البزي، قنبل) بالرسم العثماني والإملائي.</div>
                    <a href="/api/v1/quran/editions" class="card-link" target="_blank">عرض الروايات 9 &larr;</a>
                </div>

                <div class="card">
                    <div class="card-icon">🎨</div>
                    <div class="card-title">محرك التجويد الملون</div>
                    <div class="card-desc">إحداثيات مواضع الإدغام، الإخفاء، الإقلاب، القلقلة، والمدود بدقة الـ Unicode Codepoints مع مخرجات HTML جاهزة.</div>
                    <a href="/api/v1/tajweed/rules" class="card-link" target="_blank">قواعد التجويد الـ 18 &larr;</a>
                </div>

                <div class="card">
                    <div class="card-icon">🖼️</div>
                    <div class="card-title">صور المصحف (604 صفحة)</div>
                    <div class="card-desc">بث مباشر لصفحات المصحف الشريف عالية الدقة (حفص، ورش، التجويد) مع روابط محلية وروابط CDN احتياطية.</div>
                    <a href="/api/v1/mushaf/page/1" class="card-link" target="_blank">بيانات الصفحة 1 &larr;</a>
                </div>

                <div class="card">
                    <div class="card-icon">🔍</div>
                    <div class="card-title">البحث المتقدم</div>
                    <div class="card-desc">محرك بحث سريع في نصوص القرآن بدون تشكيل وتطبيع الحروف للوصول الفوري للآيات.</div>
                    <a href="/api/v1/quran/search?q=الرحمن" class="card-link" target="_blank">تجربة بحث "الرحمن" &larr;</a>
                </div>

                <div class="card">
                    <div class="card-icon">🔤</div>
                    <div class="card-title">خطوط مجمع الملك فهد</div>
                    <div class="card-desc">ملفات خطوط TrueType و WOFF2 لكل رواية لتطبيقات الويب و Windows و Android مع ملف CSS جاهز.</div>
                    <a href="/static/fonts/kfgqpc.local.css" class="card-link" target="_blank">ملف kfgqpc.css &larr;</a>
                </div>

                <div class="card">
                    <div class="card-icon">🕌</div>
                    <div class="card-title">أوقات الصلاة والقبلة</div>
                    <div class="card-desc">حساب دقيق لمواقيت الصلاة واتجاه القبلة وفق الخوارزميات الفلكية الشمسية لأي إحداثيات GPS.</div>
                    <a href="/api/v1/prayer-times/today?latitude=36.8065&longitude=10.1815" class="card-link" target="_blank">مواقيت تونس &larr;</a>
                </div>

                <div class="card">
                    <div class="card-icon">📜</div>
                    <div class="card-title">الأحاديث النبوية والأذكار</div>
                    <div class="card-desc">الأربعون النووية مع الشرح والترجمة، أذكار الصباح والمساء، الرقية الشرعية، وأدعية ربنا الأربعين.</div>
                    <a href="/api/v1/hadith/nawawi" class="card-link" target="_blank">الأربعون النووية &larr;</a>
                </div>

                <div class="card">
                    <div class="card-icon">📻</div>
                    <div class="card-title">الإذاعات والتفاسير</div>
                    <div class="card-desc">بث إذاعات القرآن الكريم 24/7 لأشهر القراء وكتب التفاسير المعتمدة (الميسر، السعدي، ابن كثير، الطبري).</div>
                    <a href="/api/v1/radios" class="card-link" target="_blank">قنوات الراديو المباشر &larr;</a>
                </div>
            </div>
        </main>

        <footer>
            <p>API_ISLAM v4.0 &bull; مجمع الملك فهد لطباعة المصحف الشريف &bull; تطوير 2026</p>
        </footer>
    </body>
    </html>
    """
