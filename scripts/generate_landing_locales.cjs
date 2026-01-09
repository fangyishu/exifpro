const fs = require('fs');
const path = require('path');

const locales = ['ar', 'bn', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pa', 'pt', 'ru', 'th', 'tr', 'vi', 'zh-HK', 'zh-CN', 'en'];

const translations = {
    'en': {
        meta: { title: "Image Pro - Professional Online Image Editor", description: "Secure, fast, and private online image editor. Crop, rotate, and resize images directly in your browser without uploading to any server.", keywords: "image editor, crop image, resize image, image compression, batch image processing, format converter, online photo editor, privacy first, client-side editor" },
        nav: { logo_text: "Image Pro", cta: "Launch App" },
        hero: {
            badge: "Privacy First", free_badge: "100% Free", title_1: "Professional", title_2: "Image Processing",
            description: "Experience the power of secure, client-side image processing. No uploads needed—your photos never leave your device.",
            cta_start: "Start Editing", cta_more: "Learn More",
            features: { compression: "Compression", resize: "Resize", crop: "Crop", convert: "Convert", batch: "Batch Processing" }
        },
        templates: { title_prefix: "Essential ", title_gradient: "Tools", description: "Everything you need to perfect your images, built for speed and privacy.", item_1_title: "Smart Crop", item_1_desc: "Intelligent aspect ratio locking and centered cropping for perfect compositions.", item_2_title: "Precise Rotation", item_2_desc: "Fine-tune alignment with grid overlays and smooth 360-degree rotation.", item_3_title: "Instant Resize", "item_3_desc": "Resize your images while maintaining high quality and sharp details." },
        privacy: { title_prefix: "Your Data, ", "title_highlight": "Your Control", title_suffix: "", description: "We believe in privacy by design. Image Pro processes all your photos locally in your browser using advanced WebAssembly and Canvas technologies.", item_1_title: "No Server Uploads", item_1_desc: "Files remain on your device. Zero risk of data leaks.", item_2_title: "Offline Capable", item_2_desc: "Works without internet once loaded. Fast and reliable." },
        devices: { title: "Works Everywhere", subtitle: "Optimized for all your devices", mobile_title: "Mobile", mobile_desc: "Touch-optimized interface for on-the-go editing.", tablet_title: "Tablet", tablet_desc: "Desktop-class power with touch convenience.", laptop_title: "Desktop", laptop_desc: "Full keyboard shortcuts and precision control." },
        performance: { title_prefix: "Blazing ", title_gradient: "Fast", title_suffix: " Performance", fps_label: "Smooth UI", latency_label: "Upload Latency", export_label: "Resolution Support" },
        footer: {
            title: "Ready to Create?", description: "Join thousands of users who trust Image Pro for their daily image editing tasks.", cta: "Open Editor", copyright: "© 2024 Image Pro. All rights reserved.", attribution_prefix: "Designed by", hosted_on: "Hosted on GitHub",
            more_products: "More Products",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "Wallpaper Mockup Generator",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=en" }
    },
    'zh-CN': {
        meta: { title: "Image Pro - 专业在线图片编辑器", description: "安全、快速、隐私的在线图片编辑器。无需上传，直接在浏览器中裁剪、旋转和调整图片大小。", keywords: "图片编辑, 裁剪图片, 调整尺寸, 图片压缩, 批量处理, 格式转换, 在线修图, 隐私保护, 客户端编辑器" },
        nav: { logo_text: "图片大师", cta: "启动应用" },
        hero: {
            badge: "隐私优先", free_badge: "完全免费", title_1: "专业级", title_2: "图片处理",
            description: "体验安全可靠的客户端图片处理技术。无需上传服务器，您的照片永远不会离开您的设备。",
            cta_start: "开始编辑", cta_more: "了解更多",
            features: { compression: "图片压缩", resize: "调整尺寸", crop: "图片裁剪", convert: "格式转换", batch: "批量处理" }
        },
        templates: { title_prefix: "核心", title_gradient: "功能", description: "为您提供修饰图片所需的一切，专为速度和隐私打造。", item_1_title: "智能裁剪", item_1_desc: "智能比例锁定和居中裁剪，轻松获得完美构图。", item_2_title: "精准旋转", item_2_desc: "通过网格辅助和平滑的360度旋转微调角度。", item_3_title: "即时调整", item_3_desc: "在保持高质量和清晰细节的同时调整图片大小。" },
        privacy: { title_prefix: "您的数据，", title_highlight: "由您掌控", title_suffix: "", description: "我们坚信隐私至上。Image Pro 使用先进的 WebAssembly 和 Canvas 技术，在您的浏览器中本地处理所有照片。", item_1_title: "无需上传", item_1_desc: "文件保留在设备上，零数据泄露风险。", item_2_title: "离线可用", item_2_desc: "加载后无网也能使用，快速且可靠。" },
        devices: { title: "全平台支持", subtitle: "为您所有的设备进行了优化", mobile_title: "手机", mobile_desc: "专为触控优化的界面，随时随地修图。", tablet_title: "平板", tablet_desc: "兼具桌面级的强大功能和触控的便捷。", laptop_title: "桌面", laptop_desc: "支持全键盘快捷键和精密控制。" },
        performance: { title_prefix: "极致", title_gradient: "性能", title_suffix: "表现", fps_label: "流畅 UI", latency_label: "上传延迟", export_label: "分辨率支持" },
        footer: {
            title: "准备好开始了吗？", description: "加入成千上万信任 Image Pro 的用户，高效完成日常修图任务。", cta: "打开编辑器", copyright: "© 2024 Image Pro. 保留所有权利。", attribution_prefix: "设计方", hosted_on: "托管于 GitHub",
            more_products: "更多产品",
            cross_link_title: "壁纸大师",
            cross_link_desc: "壁纸样机生成器",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=zh-CN" }
    },
    'zh-HK': {
        meta: { title: "Image Pro - 專業在線圖片編輯器", description: "安全、快速、隱私的在線圖片編輯器。無需上傳，直接在瀏覽器中裁剪、旋轉和調整圖片大小。", keywords: "圖片編輯, 裁剪圖片, 調整尺寸, 圖片壓縮, 批量處理, 格式轉換, 在線修圖, 隱私保護, 客戶端編輯器" },
        nav: { logo_text: "圖片大師", cta: "啟動應用" },
        hero: {
            badge: "隱私優先", free_badge: "完全免費", title_1: "專業級", title_2: "圖片處理",
            description: "體驗安全可靠的客戶端圖片處理技術。無需上傳服務器，您的照片永遠不會離開您的設備。",
            cta_start: "開始編輯", cta_more: "了解更多",
            features: { compression: "圖片壓縮", resize: "調整尺寸", crop: "圖片裁剪", convert: "格式轉換", batch: "批量處理" }
        },
        templates: { title_prefix: "核心", title_gradient: "功能", description: "為您提供修飾圖片所需的一切，專為速度和隱私打造。", item_1_title: "智能裁剪", item_1_desc: "智能比例鎖定和居中裁剪，輕鬆獲得完美構圖。", item_2_title: "精準旋轉", item_2_desc: "通過網格輔助和平滑的360度旋轉微調角度。", item_3_title: "即時調整", item_3_desc: "在保持高質量和清晰細節的同時調整圖片大小。" },
        privacy: { title_prefix: "您的數據，", title_highlight: "由您掌控", title_suffix: "", description: "我們堅信隱私至上。Image Pro 使用先進的 WebAssembly 和 Canvas 技術，在您的瀏覽器中本地處理所有照片。", item_1_title: "無需上傳", item_1_desc: "文件保留在設備上，零數據洩露風險。", item_2_title: "離線可用", item_2_desc: "加載後無網也能使用，快速且可靠。" },
        devices: { title: "全平台支持", subtitle: "為您的所有設備進行了優化", mobile_title: "手機", mobile_desc: "專為觸控優化的界面，隨時隨地修圖。", tablet_title: "平板", tablet_desc: "兼具桌面級的強大功能和觸控的便捷。", laptop_title: "桌面", laptop_desc: "支持全鍵盤快捷鍵和精密控制。" },
        performance: { title_prefix: "極致", title_gradient: "性能", title_suffix: "表現", fps_label: "流暢 UI", latency_label: "上傳延遲", export_label: "分辨率支持" },
        footer: {
            title: "準備好開始了嗎？", description: "加入成千上萬信任 Image Pro 的用戶，高效完成日常修圖任務。", cta: "打開編輯器", copyright: "© 2024 Image Pro. 保留所有權利。", attribution_prefix: "設計方", hosted_on: "託管於 GitHub",
            more_products: "更多產品",
            cross_link_title: "壁紙大師",
            cross_link_desc: "壁紙樣機生成器",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=zh-HK" }
    },
    'es': {
        meta: { title: "Image Pro - Editor de Imágenes Online Profesional", description: "Editor de imágenes online seguro, rápido y privado.", keywords: "editor de imágenes, recortar imagen, redimensionar, compresión de imágenes, procesamiento por lotes, convertidor de formatos, editor en línea, privacidad" },
        nav: { logo_text: "Image Pro", cta: "Iniciar App" },
        hero: {
            badge: "Privacidad Primero", free_badge: "100% Gratis", title_1: "Procesamiento", title_2: "de Imágenes",
            description: "Experimenta el poder del procesamiento de imágenes seguro en el cliente. Sin subidas: tus fotos nunca salen de tu dispositivo.",
            cta_start: "Comenzar", cta_more: "Saber Más",
            features: { compression: "Compresión", resize: "Redimensionar", crop: "Recortar", convert: "Convertir", batch: "Procesamiento por Lotes" }
        },
        templates: { title_prefix: "Herramientas ", title_gradient: "Esenciales", description: "Todo lo que necesitas para perfeccionar tus imágenes.", item_1_title: "Recorte Inteligente", item_1_desc: "Bloqueo inteligente de relación de aspecto.", item_2_title: "Rotación Precisa", item_2_desc: "Ajuste fino con guías.", item_3_title: "Redimensionado Instantáneo", item_3_desc: "Redimensiona tus imágenes manteniendo alta calidad." },
        privacy: { title_prefix: "Tus Datos, ", title_highlight: "Tu Control", title_suffix: "", description: "Creemos en la privacidad por diseño.", item_1_title: "Sin Subidas al Servidor", item_1_desc: "Los archivos permanecen en tu dispositivo.", item_2_title: "Funciona Offline", item_2_desc: "Funciona sin internet." },
        devices: { title: "Funciona en Todas Partes", subtitle: "Optimizado para todos tus dispositivos", mobile_title: "Móvil", mobile_desc: "Interfaz optimizada.", tablet_title: "Tablet", tablet_desc: "Potencia de escritorio.", laptop_title: "Escritorio", laptop_desc: "Control de precisión." },
        performance: { title_prefix: "Rendimiento ", title_gradient: "Ultrarrápido", title_suffix: "", fps_label: "UI Fluida", latency_label: "Latencia", export_label: "Resolución" },
        footer: {
            title: "¿Listo para Crear?", description: "Únete a miles de usuarios.", cta: "Abrir Editor", copyright: "© 2024 Image Pro.", attribution_prefix: "Diseñado por", hosted_on: "Alojado en GitHub",
            more_products: "Más Productos",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "Generador de Maquetas de Fondos",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=es" }
    },
    'fr': {
        meta: { title: "Image Pro - Éditeur d'Image en Ligne Professionnel", description: "Éditeur d'image en ligne sécurisé.", keywords: "éditeur d'image, recadrer, redimensionner, compression d'images, traitement par lot, convertisseur de formats, confidentialité" },
        nav: { logo_text: "Image Pro", cta: "Lancer l'App" },
        hero: {
            badge: "Confidentialité d'Abord", free_badge: "100% Gratuit", title_1: "Traitement", title_2: "d'Image Pro",
            description: "Découvrez la puissance du traitement d'image sécurisé côté client.",
            cta_start: "Commencer", cta_more: "En Savoir Plus",
            features: { compression: "Compression", resize: "Redimensionner", crop: "Recadrer", convert: "Convertir", batch: "Traitement par Lot" }
        },
        templates: { title_prefix: "Outils ", title_gradient: "Essentiels", description: "Tout ce dont vous avez besoin.", item_1_title: "Recadrage Intelligent", item_1_desc: "Verrouillage intelligent.", item_2_title: "Rotation Précise", item_2_desc: "Ajustement fin.", item_3_title: "Redimensionnement", item_3_desc: "Haute qualité." },
        privacy: { title_prefix: "Vos Données, ", title_highlight: "Votre Contrôle", title_suffix: "", description: "Nous croyons en la confidentialité.", item_1_title: "Aucun Téléchargement", item_1_desc: "Fichiers locaux.", item_2_title: "Hors ligne", item_2_desc: "Rapide et fiable." },
        devices: { title: "Partout", subtitle: "Optimisé partout", mobile_title: "Mobile", mobile_desc: "Tactile.", tablet_title: "Tablette", tablet_desc: "Puissance.", laptop_title: "Bureau", laptop_desc: "Précision." },
        performance: { title_prefix: "Performance ", title_gradient: "Éclair", title_suffix: "", fps_label: "UI Fluide", latency_label: "Latence", export_label: "Résolution" },
        footer: {
            title: "Prêt ?", description: "Rejoignez-nous.", cta: "Ouvrir", copyright: "© 2024 Image Pro.", attribution_prefix: "Conçu par", hosted_on: "GitHub",
            more_products: "Plus de Produits",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "Générateur de Maquettes de Fond d'Écran",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=fr" }
    },
    'de': {
        meta: { title: "Image Pro - Professioneller Online-Bildeditor", description: "Sicherer Online-Bildeditor.", keywords: "Bildeditor, Bild zuschneiden, Größe ändern, Bildkomprimierung, Stapelverarbeitung, Format-Konverter, Datenschutz" },
        nav: { logo_text: "Image Pro", cta: "App Starten" },
        hero: {
            badge: "Privatsphäre Zuerst", free_badge: "100% Kostenlos", title_1: "Professionelle", title_2: "Bildverarbeitung",
            description: "Sichere bildverarbeitung im Client.",
            cta_start: "Starten", cta_more: "Mehr",
            features: { compression: "Komprimierung", resize: "Größe ändern", crop: "Zuschneiden", convert: "Konvertieren", batch: "Stapelverarbeitung" }
        },
        templates: { title_prefix: "Wesentliche ", title_gradient: "Werkzeuge", description: "Alles was Sie brauchen.", item_1_title: "Zuschneiden", item_1_desc: "Intelligent.", item_2_title: "Rotation", item_2_desc: "Präzise.", item_3_title: "Skalieren", item_3_desc: "Qualität." },
        privacy: { title_prefix: "Ihre Daten, ", title_highlight: "Ihre Kontrolle", title_suffix: "", description: "Privacy by Design.", item_1_title: "Keine Uploads", item_1_desc: "Lokal.", item_2_title: "Offline", item_2_desc: "Schnell." },
        devices: { title: "Überall", subtitle: "Optimiert", mobile_title: "Mobil", mobile_desc: "Touch.", tablet_title: "Tablet", tablet_desc: "Power.", laptop_title: "Desktop", laptop_desc: "Kontrolle." },
        performance: { title_prefix: "Schnelle ", title_gradient: "Leistung", title_suffix: "", fps_label: "UI", latency_label: "Latenz", export_label: "Auflösung" },
        footer: {
            title: "Bereit?", description: "Starten Sie jetzt.", cta: "Öffnen", copyright: "© 2024 Image Pro.", attribution_prefix: "Design", hosted_on: "GitHub",
            more_products: "Mehr Produkte",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "Hintergrundbild-Mockup-Generator",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=de" }
    },
    'ja': {
        meta: { title: "Image Pro - プロフェッショナルオンライン画像エディタ", description: "安全、高速、プライベート。", keywords: "画像エディタ, トリミング, リサイズ, 画像圧縮, 一括処理, 形式変換, プライバシー" },
        nav: { logo_text: "Image Pro", cta: "アプリを起動" },
        hero: {
            badge: "プライバシー重視", free_badge: "100% 無料", title_1: "プロフェッショナル", title_2: "画像処理",
            description: "安全なクライアントサイド画像処理。",
            cta_start: "編集を開始", cta_more: "詳細",
            features: { compression: "圧縮", resize: "リサイズ", crop: "トリミング", convert: "変換", batch: "一括処理" }
        },
        templates: { title_prefix: "必須 ", title_gradient: "ツール", description: "必要なすべて。", item_1_title: "トリミング", item_1_desc: "スマート。", item_2_title: "回転", item_2_desc: "精密。", item_3_title: "リサイズ", item_3_desc: "高品質。" },
        privacy: { title_prefix: "データは", title_highlight: "あなたのもの", title_suffix: "", description: "プライバシー重視。", item_1_title: "アップロードなし", item_1_desc: "ローカル処理。", item_2_title: "オフライン", item_2_desc: "高速。" },
        devices: { title: "どこでも", subtitle: "最適化済み", mobile_title: "モバイル", mobile_desc: "タッチ。", tablet_title: "タブレット", tablet_desc: "パワー。", laptop_title: "デスクトップ", laptop_desc: "制御。" },
        performance: { title_prefix: "爆速 ", title_gradient: "パフォーマンス", title_suffix: "", fps_label: "UI", latency_label: "遅延", export_label: "解像度" },
        footer: {
            title: "準備完了？", description: "今すぐ開始。", cta: "開く", copyright: "© 2024 Image Pro.", attribution_prefix: "Design", hosted_on: "GitHub",
            more_products: "その他の製品",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "壁紙モックアップジェネレーター",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=ja" }
    },
    'pt': {
        meta: { title: "Image Pro - Editor de Imagem Profissional", description: "Seguro, rápido e privado.", keywords: "editor de imagem, recortar, redimensionar, compressão de imagem, processamento em lote, conversor de formato, privacidade" },
        nav: { logo_text: "Image Pro", cta: "Iniciar App" },
        hero: {
            badge: "Privacidade Primeiro", free_badge: "100% Grátis", title_1: "Processamento", title_2: "de Imagem",
            description: "Processamento seguro no cliente.",
            cta_start: "Começar", cta_more: "Mais",
            features: { compression: "Compressão", resize: "Redimensionar", crop: "Recortar", convert: "Converter", batch: "Processamento em Lote" }
        },
        templates: { title_prefix: "Ferramentas ", title_gradient: "Essenciais", description: "Tudo o que precisa.", item_1_title: "Recorte", item_1_desc: "Inteligente.", item_2_title: "Rotação", item_2_desc: "Precisa.", item_3_title: "Redimensionar", item_3_desc: "Alta qualidade." },
        privacy: { title_prefix: "Seus Dados, ", title_highlight: "Seu Controle", title_suffix: "", description: "Privacidade total.", item_1_title: "Sem Uploads", item_1_desc: "Local.", item_2_title: "Offline", item_2_desc: "Rápido." },
        devices: { title: "Em todo lugar", subtitle: "Otimizado", mobile_title: "Móvel", mobile_desc: "Toque.", tablet_title: "Tablet", tablet_desc: "Poder.", laptop_title: "Desktop", laptop_desc: "Precisão." },
        performance: { title_prefix: "Rápido ", title_gradient: "Performance", title_suffix: "", fps_label: "UI", latency_label: "Latência", export_label: "Resolução" },
        footer: {
            title: "Pronto?", description: "Junte-se a nós。", cta: "Abrir", copyright: "© 2024 Image Pro.", attribution_prefix: "Design", hosted_on: "GitHub",
            more_products: "Mais Produtos",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "Gerador de Mockup de Papel de Parede",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=pt" }
    },
    'it': {
        meta: { title: "Image Pro", description: "Editor sicuro." }, nav: { logo_text: "Image Pro", cta: "Avvia" },
        hero: { badge: "Privacy", free_badge: "Gratis", title_1: "Elaborazione", title_2: "Immagini", description: "Sicuro e veloce.", cta_start: "Inizia", cta_more: "Info", features: { compression: "Compressione", resize: "Ridimensiona", crop: "Ritaglia", convert: "Converti", batch: "Elaborazione Batch" } },
        templates: { title_prefix: "Strumenti", title_gradient: "Essenziali", description: "Tutto incluso.", item_1_title: "Ritaglio", item_1_desc: "Smart.", item_2_title: "Rotazione", item_2_desc: "Preciso.", item_3_title: "Ridimensiona", item_3_desc: "Qualità." },
        privacy: { title_prefix: "Tuoi Dati", title_highlight: "Tuo Controllo", title_suffix: "", description: "Locale.", item_1_title: "No Upload", item_1_desc: "Sicuro.", item_2_title: "Offline", item_2_desc: "Veloce." },
        devices: { title: "Ovunque", subtitle: "Otimizzato", mobile_title: "Mobile", mobile_desc: "Touch.", tablet_title: "Tablet", tablet_desc: "Power.", laptop_title: "Desktop", laptop_desc: "Controllo." },
        performance: { title_prefix: "Veloce", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "Latenza", export_label: "Pixel" },
        footer: {
            title: "Pronto?", description: "Inizia ora.", cta: "Apri", copyright: "© 2024", attribution_prefix: "By", hosted_on: "GitHub",
            more_products: "Altri Prodotti",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "Generatore di Mockup Sfondi",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=it" }
    },
    'ru': {
        meta: { title: "Image Pro", description: "Редактор." }, nav: { logo_text: "Image Pro", cta: "Запуск" },
        hero: { badge: "Приватность", free_badge: "Бесплатно", title_1: "Обработка", title_2: "Изображений", description: "Быстро и безопасно.", cta_start: "Начать", cta_more: "Инфо", features: { compression: "Сжатие", resize: "Изменить размер", crop: "Обрезать", convert: "Конвертировать", batch: "Пакетная Обработка" } },
        templates: { title_prefix: "Важные", title_gradient: "Инструменты", description: "Все что нужно.", item_1_title: "Обрезка", item_1_desc: "Умная.", item_2_title: "Вращение", item_2_desc: "Точное.", item_3_title: "Размер", item_3_desc: "Качество." },
        privacy: { title_prefix: "Данные", title_highlight: "Ваши", title_suffix: "", description: "Локально.", item_1_title: "Без Серверов", item_1_desc: "Безопасно.", item_2_title: "Офлайн", item_2_desc: "Быстро." },
        devices: { title: "Везде", subtitle: "Оптимизация", mobile_title: "Мобильные", mobile_desc: "Тач.", tablet_title: "Планшеты", tablet_desc: "Мощь.", laptop_title: "ПК", laptop_desc: "Контроль." },
        performance: { title_prefix: "Скорость", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "Пинг", export_label: "Разрешение" },
        footer: {
            title: "Готовы?", description: "Вперед.", cta: "Открыть", copyright: "© 2024", attribution_prefix: "Дизайн", hosted_on: "GitHub",
            more_products: "Другие Продукты",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "Генератор Мокапов Обоев",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=ru" }
    },
    'ko': {
        meta: { title: "Image Pro", description: "편집기." }, nav: { logo_text: "Image Pro", cta: "실행" },
        hero: { badge: "보안", free_badge: "무료", title_1: "이미지", title_2: "처리", description: "빠르고 안전합니다.", cta_start: "시작", cta_more: "정보", features: { compression: "압축", resize: "크기 조정", crop: "자르기", convert: "변환", batch: "일괄 처리" } },
        templates: { title_prefix: "필수", title_gradient: "도구", description: "모든 기능.", item_1_title: "자르기", item_1_desc: "스마트.", item_2_title: "회전", item_2_desc: "정밀.", item_3_title: "크기", item_3_desc: "고품질." },
        privacy: { title_prefix: "데이터", title_highlight: "보호", title_suffix: "", description: "로컬.", item_1_title: "업로드 없음", item_1_desc: "안전.", item_2_title: "오프라인", item_2_desc: "빠름." },
        devices: { title: "어디서나", subtitle: "최적화", mobile_title: "모바일", mobile_desc: "터치.", tablet_title: "태블릿", tablet_desc: "파워.", laptop_title: "데스크탑", laptop_desc: "제어." },
        performance: { title_prefix: "성능", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "지연", export_label: "해상도" },
        footer: {
            title: "준비?", description: "시작하세요.", cta: "열기", copyright: "© 2024", attribution_prefix: "By", hosted_on: "GitHub",
            more_products: "더 많은 제품",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "배경화면 목업 생성기",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=ko" }
    },
    'ar': {
        meta: { title: "Image Pro", description: "محرر." }, nav: { logo_text: "Image Pro", cta: "بدء" },
        hero: { badge: "خصوصية", free_badge: "مجاني", title_1: "معالجة", title_2: "الصور", description: "سريع وآمن.", cta_start: "ابدأ", cta_more: "المزيد", features: { compression: "ضغط", resize: "تغيير الحجم", crop: "قص", convert: "تحويل", batch: "معالجة مجمعة" } },
        templates: { title_prefix: "أدوات", title_gradient: "أساسية", description: "كل شيء.", item_1_title: "قص", item_1_desc: "ذكي.", item_2_title: "تدوير", item_2_desc: "دقيق.", item_3_title: "حجم", item_3_desc: "جودة." },
        privacy: { title_prefix: "بياناتك", title_highlight: "لك", title_suffix: "", description: "محلي.", item_1_title: "لا تحميل", item_1_desc: "آمن.", item_2_title: "دون اتصال", item_2_desc: "سريع." },
        devices: { title: "كل مكان", subtitle: "محسن", mobile_title: "جوال", mobile_desc: "لمس.", tablet_title: "لوحي", tablet_desc: "قوة.", laptop_title: "مكتب", laptop_desc: "تحكم." },
        performance: { title_prefix: "أداء", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "تأخير", export_label: "دقة" },
        footer: {
            title: "جاهز؟", description: "ابدأ.", cta: "فتح", copyright: "© 2024", attribution_prefix: "تصميم", hosted_on: "GitHub",
            more_products: "More Products",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "مولد نماذج الخلفيات",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=ar" }
    },
    'hi': {
        meta: { title: "Image Pro", description: "संपादक" }, nav: { logo_text: "Image Pro", cta: "शुरू" },
        hero: { badge: "गोपनीयता", free_badge: "मुफ़्त", title_1: "छवि", title_2: "प्रसंस्करण", description: "सुरक्षित और तेज़।", cta_start: "शुरू", cta_more: "अधिक", features: { compression: "संपीड़न", resize: "आकार बदलें", crop: "क्रॉप", convert: "कन्वर्ट", batch: "बैच प्रोसेसिंग" } },
        templates: { title_prefix: "आवश्यक", title_gradient: "उपकरण", description: "सब कुछ।", item_1_title: "क्रॉप", item_1_desc: "स्मार्ट।", item_2_title: "रोटेशन", item_2_desc: "सटीक।", item_3_title: "आकार", item_3_desc: "गुणवत्ता।" },
        privacy: { title_prefix: "डेटा", title_highlight: "आपका", title_suffix: "", description: "स्थानीय।", item_1_title: "अपलोड नहीं", item_1_desc: "सुरक्षित।", item_2_title: "ऑफ़लाइन", item_2_desc: "तेज़।" },
        devices: { title: "हर जगह", subtitle: "अनुकूलित", mobile_title: "मोबाइल", mobile_desc: "टच।", tablet_title: "टैबलेट", tablet_desc: "शक्ति।", laptop_title: "डेस्कटॉप", laptop_desc: "नियंत्रण।" },
        performance: { title_prefix: "प्रदर्शन", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "विलंब", export_label: "रिज़ॉल्यूशन" },
        footer: {
            title: "तैयार?", description: "शुरू करें।", cta: "खोलें", copyright: "© 2024", attribution_prefix: "By", hosted_on: "GitHub",
            more_products: "More Products",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "वॉलपेपर मॉकअप जेनरेटर",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=hi" }
    },
    'bn': {
        meta: { title: "Image Pro", description: "এডিটর" }, nav: { logo_text: "Image Pro", cta: "শুরু" },
        hero: { badge: "গোপনীয়তা", free_badge: "ফ্রি", title_1: "ইমেজ", title_2: "প্রসেসিং", description: "নিরাপদ।", cta_start: "শুরু", cta_more: "আরও", features: { compression: "কমপ্রেশন", resize: "আকার পরিবর্তন", crop: "ক্রপ", convert: "রূপান্তর", batch: "ব্যাচ প্রসেসিং" } },
        templates: { title_prefix: "টুলস", title_gradient: "", description: "সব।", item_1_title: "ক্রপ", item_1_desc: "স্মার্ট।", item_2_title: "রোটেশন", item_2_desc: "নির্ভুল।", item_3_title: "সাইজ", item_3_desc: "কোয়ালিটি।" },
        privacy: { title_prefix: "ডেটা", title_highlight: "আপনার", title_suffix: "", description: "লোকাল।", item_1_title: "নো আপলোড", item_1_desc: "সেফ।", item_2_title: "অফলাইন", item_2_desc: "ফাস্ট।" },
        devices: { title: "সর্বত্র", subtitle: "অপ্টিমাইজড", mobile_title: "মোবাইল", mobile_desc: "টাচ।", tablet_title: "ট্যাবলেট", tablet_desc: "পাওয়ার।", laptop_title: "ডেস্কটপ", laptop_desc: "কন্ট্রোল।" },
        performance: { title_prefix: "পারফর্মেন্স", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "লেটেন্সি", export_label: "রেজোলিউশন" },
        footer: {
            title: "রেডি?", description: "শুরু।", cta: "ওপেন", copyright: "© 2024", attribution_prefix: "By", hosted_on: "GitHub",
            more_products: "More Products",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "ওয়ালপেপার মকআপ জেনারেটর",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=bn" }
    },
    'vi': {
        meta: { title: "Image Pro", description: "Trình sửa ảnh" }, nav: { logo_text: "Image Pro", cta: "Mở" },
        hero: { badge: "Bảo mật", free_badge: "Miễn phí", title_1: "Xử lý", title_2: "Hình ảnh", description: "An toàn và nhanh chóng.", cta_start: "Bắt đầu", cta_more: "Thêm", features: { compression: "Nén", resize: "Đổi kích thước", crop: "Cắt", convert: "Chuyển đổi", batch: "Xử lý hàng loạt" } },
        templates: { title_prefix: "Công cụ", title_gradient: "", description: "Đầy đủ.", item_1_title: "Cắt", item_1_desc: "Thông minh.", item_2_title: "Xoay", item_2_desc: "Chính xác.", item_3_title: "Kích thước", item_3_desc: "Chất lượng." },
        privacy: { title_prefix: "Dữ liệu", title_highlight: "Của bạn", title_suffix: "", description: "Cục bộ.", item_1_title: "Không tải lên", item_1_desc: "An toàn.", item_2_title: "Ngoại tuyến", item_2_desc: "Nhanh." },
        devices: { title: "Mọi nơi", subtitle: "Tối ưu", mobile_title: "Di động", mobile_desc: "Cảm ứng.", tablet_title: "Tablet", tablet_desc: "Mạnh mẽ.", laptop_title: "Desktop", laptop_desc: "Kiểm soát." },
        performance: { title_prefix: "Hiệu suất", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "Trễ", export_label: "Độ phân giải" },
        footer: {
            title: "Sẵn sàng?", description: "Bắt đầu.", cta: "Mở", copyright: "© 2024", attribution_prefix: "By", hosted_on: "GitHub",
            more_products: "More Products",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "Trình Tạo Mockup Hình Nền",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=vi" }
    },
    'th': {
        meta: { title: "Image Pro", description: "แก้ไขรูป" }, nav: { logo_text: "Image Pro", cta: "เปิด" },
        hero: { badge: "ส่วนตัว", free_badge: "ฟรี", title_1: "ประมวลผล", title_2: "รูปภาพ", description: "ปลอดภัยและรวดเร็ว", cta_start: "เริ่ม", cta_more: "เพิ่มเติม", features: { compression: "บีบอัด", resize: "ปรับขนาด", crop: "ตัดรูป", convert: "แปลงไฟล์", batch: "ประมวลผลแบบกลุ่ม" } },
        templates: { title_prefix: "เครื่องมือ", title_gradient: "", description: "ครบครัน", item_1_title: "ตัด", item_1_desc: "ฉลาด", item_2_title: "หมุน", item_2_desc: "แม่นยำ", item_3_title: "ขนาด", item_3_desc: "คุณภาพ" },
        privacy: { title_prefix: "ข้อมูล", title_highlight: "ของคุณ", title_suffix: "", description: "ในเครื่อง", item_1_title: "ไม่อัปโหลด", item_1_desc: "ปลอดภัย", item_2_title: "ออฟไลน์", item_2_desc: "เร็ว" },
        devices: { title: "ทุกที่", subtitle: "เหมาะสม", mobile_title: "มือถือ", mobile_desc: "สัมผัส", tablet_title: "แท็บเล็ต", tablet_desc: "แรง", laptop_title: "เดสก์ท็อป", laptop_desc: "ควบคุม" },
        performance: { title_prefix: "เร็ว", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "หน่วง", export_label: "ละเอียด" },
        footer: {
            title: "พร้อม?", description: "เริ่มเลย", cta: "เปิด", copyright: "© 2024", attribution_prefix: "By", hosted_on: "GitHub",
            more_products: "More Products",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "เครื่องสร้างแบบจำลองวอลเปเปอร์",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=th" }
    },
    'tr': {
        meta: { title: "Image Pro", description: "Editör" }, nav: { logo_text: "Image Pro", cta: "Başlat" },
        hero: { badge: "Gizlilik", free_badge: "Ücretsiz", title_1: "Resim", title_2: "İşleme", description: "Güvenli ve hızlı.", cta_start: "Başla", cta_more: "Bilgi", features: { compression: "Sıkıştırma", resize: "Boyutlandır", crop: "Kırp", convert: "Dönüştür", batch: "Toplu İşlem" } },
        templates: { title_prefix: "Araçlar", title_gradient: "", description: "Her şey.", item_1_title: "Kırpma", item_1_desc: "Akıllı.", item_2_title: "Döndürme", item_2_desc: "Hassas.", item_3_title: "Boyut", item_3_desc: "Kalite." },
        privacy: { title_prefix: "Veri", title_highlight: "Sizin", title_suffix: "", description: "Yerel.", item_1_title: "Yükleme Yok", item_1_desc: "Güvenli.", item_2_title: "Çevrimdışı", item_2_desc: "Hızlı." },
        devices: { title: "Her Yerde", subtitle: "Optimize", mobile_title: "Mobil", mobile_desc: "Dokunmatik.", tablet_title: "Tablet", tablet_desc: "Güçlü.", laptop_title: "Masaüstü", laptop_desc: "Kontrol." },
        performance: { title_prefix: "Hız", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "Gecikme", export_label: "Çözünürlük" },
        footer: {
            title: "Hazır?", description: "Başlayın.", cta: "Aç", copyright: "© 2024", attribution_prefix: "By", hosted_on: "GitHub",
            more_products: "More Products",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "Duvar Kağıdı Mockup Oluşturucu",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=tr" }
    },
    'pa': {
        meta: { title: "Image Pro", description: "ਸੰਪਾਦਕ" }, nav: { logo_text: "Image Pro", cta: "ਚਲਾਓ" },
        hero: { badge: "ਗੋਪਨੀਯਤਾ", free_badge: "ਮੁਫ਼ਤ", title_1: "ਚਿੱਤਰ", title_2: "ਪ੍ਰੋਸੈਸਿੰਗ", description: "ਸੁਰੱਖਿਅਤ।", cta_start: "ਸ਼ੁਰੂ", cta_more: "ਹੋਰ", features: { compression: "ਕੰਪਰੈਸ਼ਨ", resize: "ਆਕਾਰ ਬਦਲੋ", crop: "ਕ੍ਰੌਪ", convert: "ਬਦਲੋ", batch: "ਬੈਚ ਪ੍ਰੋਸੈਸਿੰਗ" } },
        templates: { title_prefix: "ਟੂਲ", title_gradient: "", description: "ਸਭ ਕੁਝ।", item_1_title: "ਕ੍ਰੌਪ", item_1_desc: "ਸਮਾਰਟ।", item_2_title: "ਰੋਟੇਸ਼ਨ", item_2_desc: "ਸਹੀ।", item_3_title: "ਸਾਈਜ਼", item_3_desc: "ਵਧੀਆ।" },
        privacy: { title_prefix: "ਡਾਟਾ", title_highlight: "ਤੁਹਾਡਾ", title_suffix: "", description: "ਲੋਕਲ।", item_1_title: "ਨੋ ਅਪਲੋਡ", item_1_desc: "ਸੇਫ।", item_2_title: "ਔਫਲਾਈਨ", item_2_desc: "ਤੇਜ਼।" },
        devices: { title: "ਹਰ ਥਾਂ", subtitle: "ਅਨੁਕੂਲਿਤ", mobile_title: "ਮੋਬਾਈਲ", mobile_desc: "ਟੱਚ।", tablet_title: "ਟੈਬਲੇਟ", tablet_desc: "ਪਾਵਰ।", laptop_title: "ਡੈਸਕਟਾਪ", laptop_desc: "ਕੰਟਰੋਲ।" },
        performance: { title_prefix: "ਤੇਜ਼", title_gradient: "", title_suffix: "", fps_label: "UI", latency_label: "ਲੇਟੈਂਸੀ", export_label: "ਰੈਜ਼ੋਲਿਊਸ਼ਨ" },
        footer: {
            title: "ਤਿਆਰ?", description: "ਸ਼ੁਰੂ ਕਰੋ।", cta: "ਖੋਲ੍ਹੋ", copyright: "© 2024", attribution_prefix: "By", hosted_on: "GitHub",
            more_products: "More Products",
            cross_link_title: "Wallpaper Pro",
            cross_link_desc: "ਵਾਲਪੇਪਰ ਮੋਕਅਪ ਜਨਰੇਟਰ",
            cross_link_url: "https://wallpaperpro.fandx.vip/"
        },
        urls: { app: "/app/?lang=pa" }
    }
};

locales.forEach(lang => {
    let content;
    if (translations[lang]) {
        content = translations[lang];
    } else {
        // Fallback or previously generated logic (should ideally not happen if all 18 are covered)
        console.warn(`Missing full translation for ${lang}, skipping overwrite to preserve or check manual.`);
        return;
    }

    // Ensure URL param is set correctly regardless
    content.urls.app = `/app/?lang=${lang}`;

    // Set cross-link URL with language path
    const wallpaperProBase = 'https://wallpaperpro.fandx.vip';
    if (lang === 'en') {
        content.footer.cross_link_url = `${wallpaperProBase}/`;
    } else {
        content.footer.cross_link_url = `${wallpaperProBase}/${lang}/`;
    }

    const filePath = path.join(__dirname, '../locales/landing', `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Generated ${lang}.json`);
});
