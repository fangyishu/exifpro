
import React, { useState } from 'react';
import { Button, Popover, Box, Typography } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import CheckIcon from '@mui/icons-material/Check';

const APPS = [
    {
        id: 'imagepro',
        names: {
            zh: '图片大师',
            en: 'Image Pro'
        },
        descriptions: {
            'zh-CN': '图片压缩、裁剪、尺寸调整、格式转换',
            'zh-HK': '圖片壓縮、裁剪、尺寸調整、格式轉換',
            en: 'Image Compression, Crop, Resize, Convert',
            es: 'Compresión, Recorte, Redimensionado, Conversión',
            ar: 'ضغط الصور، القص، تغيير الحجم، التحويل',
            hi: 'छवि संपीड़न, फसल, काटना, आकार बदलना, रूपांतरण',
            bn: 'ইমেজ কমপ্রেশন, ক্রপ, রিসাইজ, কনভার্ট',
            pt: 'Compressão, Recorte, Redimensionamento, Conversão',
            ru: 'Сжатие, Обрезка, Изменение размера, Конвертация',
            ja: '画像圧縮、トリミング、サイズ変更、変換',
            pa: 'ਚਿੱਤਰ ਕੰਪਰੈਸ਼ਨ, ਕ੍ਰੌਪ, ਰੀਸਾਈਜ਼, ਕਨਵਰਟ',
            de: 'Komprimieren, Zuschneiden, Ändern, Konvertieren',
            fr: 'Compression, Recadrage, Redimensionnement, Conversion',
            tr: 'Sıkıştırma, Kırpma, Boyutlandırma, Dönüştürme',
            vi: 'Nén, Cắt, Thay đổi kích thước, Chuyển đổi',
            ko: '이미지 압축, 자르기, 크기 조정, 변환',
            it: 'Compressione, Ritaglio, Ridimensionamento, Conversione',
            th: 'บีบอัดรูปภาพ, ตัด, ปรับขนาด, แปลงไฟล์'
        },
        url: 'https://imagepro.fandx.vip/app/',
        logoUrl: '/logo.png'
    },
    {
        id: 'wallpaperpro',
        names: {
            zh: '壁纸大师',
            en: 'Wallpaper Pro'
        },
        descriptions: {
            'zh-CN': '壁纸样机生成器',
            'zh-HK': '壁紙樣機生成器',
            en: 'Wallpaper Mockup Generator',
            es: 'Generador de Maquetas de Fondos',
            ar: 'مولد نماذج الخلفيات',
            hi: 'वॉलपेपर मॉकअप जेनरेटर',
            bn: 'ওয়ালপেপার মকআপ জেনারেটর',
            pt: 'Gerador de Mockup de Papel de Parede',
            ru: 'Генератор Мокапов Обоев',
            ja: '壁紙モックアップジェネレーター',
            pa: 'ਵਾਲਪੇਪਰ ਮੋਕਅਪ ਜਨਰੇਟਰ',
            de: 'Hintergrundbild-Mockup-Generator',
            fr: 'Générateur de Maquettes de Fond d\'Écran',
            tr: 'Duvar Kağıdı Mockup Oluşturucu',
            vi: 'Trình Tạo Mockup Hình Nền',
            ko: '배경화면 목업 생성기',
            it: 'Generatore di Mockup Sfondi',
            th: 'เครื่องสร้างแบบจำลองวอลเปเปอร์'
        },
        url: 'https://wallpaperpro.fandx.vip/app/',
        logoUrl: '/wallpaperpro-logo.png'
    }
];

interface AppSwitcherProps {
    currentAppId: 'imagepro' | 'wallpaperpro';
    currentLanguage?: string;
}

const AppSwitcher: React.FC<AppSwitcherProps> = ({ currentAppId, currentLanguage = 'en' }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAppClick = (appId: string, appUrl: string) => {
        if (appId === currentAppId) return;

        // Get current search params (language)
        const currentParams = new URLSearchParams(window.location.search);
        const lang = currentParams.get('lang');

        let destination = appUrl;
        if (lang) {
            destination += `?lang=${lang}`;
        }

        window.location.href = destination;
        handleClose();
    };

    const getAppName = (app: typeof APPS[0]) => {
        const isChinese = currentLanguage.startsWith('zh');
        return isChinese ? app.names.zh : app.names.en;
    };

    const getAppDescription = (app: typeof APPS[0]) => {
        // Direct match
        if (app.descriptions[currentLanguage as keyof typeof app.descriptions]) {
            return app.descriptions[currentLanguage as keyof typeof app.descriptions];
        }
        // Fallback for zh variants if not exact match (though we covered them)
        if (currentLanguage.startsWith('zh')) {
            return app.descriptions['zh-CN'];
        }
        // Default to English
        return app.descriptions.en;
    };

    const open = Boolean(anchorEl);
    const id = open ? 'app-switcher-popover' : undefined;

    return (
        <>
            <Button
                aria-describedby={id}
                onClick={handleClick}
                sx={{
                    color: 'white',
                    textTransform: 'none',
                    minWidth: 'auto',
                    padding: '8px',
                    borderRadius: '50%',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                <AppsIcon sx={{ fontSize: '1.25rem' }} />
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        p: 1.5,
                        width: 360, // Increased width as requested
                        backgroundColor: '#ffffff',
                        color: 'text.primary',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                        borderRadius: 3,
                        mt: 1
                    }
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {APPS.map((app) => {
                        const isCurrent = currentAppId === app.id;
                        return (
                            <Box
                                key={app.id}
                                onClick={() => handleAppClick(app.id, app.url)}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    cursor: isCurrent ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: isCurrent ? '#f0f9ff' : 'transparent',
                                    opacity: isCurrent ? 1 : 0.9,
                                    '&:hover': {
                                        backgroundColor: isCurrent ? '#f0f9ff' : '#f5f5f5',
                                    },
                                    transition: 'all 0.2s',
                                    pointerEvents: isCurrent ? 'none' : 'auto'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
                                    <Box sx={{
                                        width: 44, // Slightly larger container
                                        height: 44, // Slightly larger container
                                        borderRadius: 2,
                                        backgroundColor: '#1976d2',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Box
                                            component="img"
                                            src={app.logoUrl}
                                            alt={getAppName(app)}
                                            sx={{
                                                width: 28, // Slightly larger logo
                                                height: 28, // Slightly larger logo
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <Typography variant="body1" sx={{
                                            fontWeight: isCurrent ? 600 : 600,
                                            fontSize: '0.95rem',
                                            color: isCurrent ? '#0ea5e9' : 'text.primary',
                                            lineHeight: 1.2
                                        }}>
                                            {getAppName(app)}
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            color: 'text.secondary',
                                            fontSize: '0.75rem',
                                            mt: 0.5,
                                            lineHeight: 1.2,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {getAppDescription(app)}
                                        </Typography>
                                    </Box>
                                </Box>
                                {isCurrent && (
                                    <CheckIcon sx={{ fontSize: '1.1rem', color: '#0ea5e9', ml: 1, flexShrink: 0 }} />
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Popover>
        </>
    );
};

export default AppSwitcher;
