
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { getTheme } from './theme';
import { translations } from './constants/translations';
import TopNavBar from './components/Layout/TopNavBar';
import LeftPanel from './components/Layout/LeftPanel';
import CenterPanel from './components/Layout/CenterPanel';
import RightPanel from './components/Layout/RightPanel';
import { useAnalytics } from './hooks/useAnalytics';
import exifr from 'exifr';

import defaultImage1 from './assets/default_1.jpg';

// Image State Interface
interface ImageState {
    id: string;
    url: string;
    originalUrl: string;
    name: string;
    // Removed crop stuff
    originalMeta?: { width: number; height: number; size: number; type?: string };
}

const defaultImages: ImageState[] = [
    {
        id: 'default-1',
        url: defaultImage1,
        originalUrl: defaultImage1,
        name: 'Default 1'
    }
];

function App() {
    const [language, setLanguage] = useState<string>(() => {
        const params = new URLSearchParams(window.location.search);
        const langParam = params.get('lang');
        if (langParam && (translations as any)[langParam]) return langParam;
        const storedLang = localStorage.getItem('language');
        if (storedLang && (translations as any)[storedLang]) return storedLang;
        return 'zh-CN';
    });

    const [images, setImages] = useState<ImageState[]>(defaultImages);
    const [activeImageId, setActiveImageId] = useState<string | null>('default-1');
    const [exifDataMap, setExifDataMap] = useState<Record<string, any>>({});
    const [loadingExif, setLoadingExif] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const theme = useMemo(() => getTheme(), []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = (translations as Record<string, any>)[language] || translations['en'];
    const { trackEvent } = useAnalytics();

    // EXIF Parsing Helper
    const parseExif = async (id: string, url: string) => {
        if (exifDataMap[id]) return; // Already parsed

        try {
            setLoadingExif(true);
            const output = await exifr.parse(url, {
                tiff: true,
                xmp: true,
                icc: true,
                ifd1: true, // IFD1 (thumbnail tags)
                exif: true,
                gps: true,
                interop: true,
                makerNote: false, // often too large/binary
                mergeOutput: false
            });
            setExifDataMap(prev => ({ ...prev, [id]: output || { 'Message': 'No EXIF found' } }));
        } catch (e) {
            console.error("EXIF Parse Error", e);
            setExifDataMap(prev => ({ ...prev, [id]: { 'Error': 'Failed to parse EXIF' } }));
        } finally {
            setLoadingExif(false);
        }
    };

    useEffect(() => {
        document.title = "Exif Pro - Photo EXIF Viewer"; // Overwrite default

        // Parse default images on load if active
        // Or lazy load when active
    }, []);

    // Effect to parse EXIF when active image changes
    useEffect(() => {
        if (activeImageId) {
            const img = images.find(i => i.id === activeImageId);
            if (img) {
                parseExif(activeImageId, img.url);
            }
        }
        setSelectedTag(null);
    }, [activeImageId, images]);


    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('lang', lang);
        window.history.pushState({}, '', newUrl);
        trackEvent('language_change', { language: lang });
    };

    const handleUpload = async (files: File[]) => {
        const newImagesPromises = files.map(async file => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.src = url;
            await new Promise(r => img.onload = r);

            return {
                id: crypto.randomUUID(),
                url: url,
                originalUrl: url,
                name: file.name,
                originalMeta: { width: img.naturalWidth, height: img.naturalHeight, size: file.size, type: file.type }
            };
        });

        const newImages = await Promise.all(newImagesPromises);
        setImages(prev => [...prev, ...newImages]);
        if (newImages.length > 0) {
            setActiveImageId(newImages[newImages.length - 1].id);
        }
    };

    const handleDeleteImage = (id: string) => {
        setImages(prev => {
            const newImages = prev.filter(img => img.id !== id);
            if (activeImageId === id) {
                if (newImages.length > 0) {
                    const index = prev.findIndex(img => img.id === id);
                    const newIndex = Math.min(index, newImages.length - 1);
                    setActiveImageId(newImages[newIndex].id);
                } else {
                    setActiveImageId(null);
                }
            }
            return newImages;
        });
        // Cleanup EXIF map? Optional
        setExifDataMap(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const handleClearAll = useCallback(() => {
        setImages([]);
        setActiveImageId(null);
        setExifDataMap({});
    }, []);

    const activeImage = useMemo(() =>
        images.find(img => img.id === activeImageId),
        [images, activeImageId]
    );


    const [isGlobalDragging, setIsGlobalDragging] = useState(false);
    const dragCounter = useRef(0);
    const handleGlobalDragEnter = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        dragCounter.current += 1;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsGlobalDragging(true);
    };
    const handleGlobalDragLeave = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        dragCounter.current -= 1;
        if (dragCounter.current <= 0) setIsGlobalDragging(false);
    };
    const handleGlobalDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleGlobalDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsGlobalDragging(false); dragCounter.current = 0;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleUpload(Array.from(e.dataTransfer.files));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
                onDragEnter={handleGlobalDragEnter}
                onDragLeave={handleGlobalDragLeave}
                onDragOver={handleGlobalDragOver}
                onDrop={handleGlobalDrop}
            >
                <TopNavBar appTitle="Exif Pro" currentLanguage={language} onLanguageChange={handleLanguageChange} />

                <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    <LeftPanel
                        onUpload={handleUpload}
                        t={t}
                        images={images}
                        activeImageId={activeImageId}
                        onSelectImage={setActiveImageId}
                        onDeleteImage={handleDeleteImage}
                        isGlobalDragOver={isGlobalDragging}
                        onClearAll={handleClearAll}
                    />

                    {/* Center Panel: Image + EXIF Table */}
                    <CenterPanel
                        activeImage={activeImage}
                        exifData={activeImageId ? exifDataMap[activeImageId] : null}
                        loading={loadingExif}
                        selectedTag={selectedTag}
                        onSelectTag={setSelectedTag}
                    />

                    {/* Right Panel: Explanation */}
                    <RightPanel
                        t={t}
                        exifData={activeImageId ? exifDataMap[activeImageId] : null}
                        selectedTag={selectedTag}
                    />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;
