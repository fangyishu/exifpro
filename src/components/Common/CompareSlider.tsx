import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

interface CompareSliderProps {
    originalUrl: string;
    compressedUrl: string; // Blob URL
    originalDims?: { w: number, h: number };
    targetDims?: { w: number, h: number };
    viewSize?: { w: number, h: number };
}

interface TransformState {
    scale: number;
    x: number;
    y: number;
}

const CompareSlider: React.FC<CompareSliderProps> = ({ originalUrl, compressedUrl, originalDims, targetDims, viewSize }) => {
    // Slider State
    const [sliderPercent, setSliderPercent] = useState(50);
    const [isSliding, setIsSliding] = useState(false);

    // Zoom/Pan State (Unified)
    const [transform, setTransform] = useState<TransformState>({ scale: 1, x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const lastPanRef = useRef({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate Render Dimensions based on independant "contain" logic
    const { renderOriginal, renderTarget } = React.useMemo(() => {
        if (!originalDims || !targetDims || !viewSize || viewSize.w === 0 || viewSize.h === 0) {
            return { renderOriginal: undefined, renderTarget: undefined };
        }

        // Fit Original to View
        const scaleOrig = Math.min(viewSize.w / originalDims.w, viewSize.h / originalDims.h);

        // Fit Target to View
        const scaleTgt = Math.min(viewSize.w / targetDims.w, viewSize.h / targetDims.h);

        return {
            renderOriginal: {
                width: originalDims.w * scaleOrig,
                height: originalDims.h * scaleOrig
            },
            renderTarget: {
                width: targetDims.w * scaleTgt,
                height: targetDims.h * scaleTgt
            }
        };
    }, [originalDims, targetDims, viewSize]);

    // --- SLIDER LOGIC ---
    const handleSliderStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation(); // Prevent panning
        setIsSliding(true);
    };

    const handleSliderMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPercent((x / rect.width) * 100);
    }, []);

    // --- PANNING LOGIC ---
    const handlePanStart = (clientX: number, clientY: number) => {
        setIsPanning(true);
        lastPanRef.current = { x: clientX, y: clientY };
    };

    const handlePanMove = useCallback((clientX: number, clientY: number) => {
        const dx = clientX - lastPanRef.current.x;
        const dy = clientY - lastPanRef.current.y;
        lastPanRef.current = { x: clientX, y: clientY };

        setTransform(prev => ({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy
        }));
    }, []);

    // --- SHARED MOVE HANDLER ---
    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (isSliding) {
            handleSliderMove(e.clientX);
        } else if (isPanning) {
            handlePanMove(e.clientX, e.clientY);
        }
    }, [isSliding, isPanning, handleSliderMove, handlePanMove]);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (isSliding) {
            handleSliderMove(e.touches[0].clientX);
        } else if (isPanning) {
            handlePanMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, [isSliding, isPanning, handleSliderMove, handlePanMove]);

    const handleEnd = useCallback(() => {
        setIsSliding(false);
        setIsPanning(false);
    }, []);

    useEffect(() => {
        if (isSliding || isPanning) {
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchend', handleEnd);
        }
        return () => {
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isSliding, isPanning, handleEnd]);

    // --- ZOOM LOGIC ---
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!containerRef.current) return;

        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;

        const rect = containerRef.current.getBoundingClientRect();
        // Mouse relative to container center
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;

        setTransform(prev => {
            const newScale = Math.min(Math.max(1, prev.scale + delta), 8); // Clamp 1x - 8x

            // If staying at 1x (or close enough), just reset to center
            if (Math.abs(newScale - 1) < 0.01) {
                return { scale: 1, x: 0, y: 0 };
            }

            const ratio = newScale / prev.scale;

            // Calculate new position to keep mouse point stable
            // NewPos = MouseRel * (1 - ratio) + OldPos * ratio
            const newX = relX * (1 - ratio) + prev.x * ratio;
            const newY = relY * (1 - ratio) + prev.y * ratio;

            return {
                scale: newScale,
                x: newX,
                y: newY
            };
        });
    };

    // Prevent default touch actions to avoid scrolling while panning
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const preventDefault = (e: Event) => e.preventDefault();
        el.addEventListener('wheel', preventDefault, { passive: false });
        // Prevent generic touch scrolling if needed, though 'touch-action: none' css handles most
        return () => el.removeEventListener('wheel', preventDefault);
    }, []);

    return (
        <Paper
            ref={containerRef}
            elevation={4}
            sx={{
                position: 'relative',
                width: '100%',
                height: '100%',  // Changed from maxWidth/maxHeight logic to fill parent
                overflow: 'hidden',
                cursor: isPanning ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
                bgcolor: '#121212'
            }}
            onMouseDown={(e) => handlePanStart(e.clientX, e.clientY)}
            onTouchStart={(e) => handlePanStart(e.touches[0].clientX, e.touches[0].clientY)}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            onWheel={handleWheel}
        >
            {/* Common Image Styles */}
            {/* We render images in layers. The 'clip' applies to the TOP layer's container. */}

            {/* Layer 1: Compressed (Full Viewport, Behind) */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                    src={compressedUrl}
                    alt="Compressed"
                    draggable={false}
                    style={{
                        width: renderTarget ? renderTarget.width : '100%',
                        height: renderTarget ? renderTarget.height : '100%',
                        objectFit: 'contain',
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                        transformOrigin: 'center center',
                        transition: isPanning ? 'none' : 'transform 0.1s'
                    }}
                />
            </Box>

            {/* Layer 2: Original (Full Viewport, Top, Clipped) */}
            <Box
                sx={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    overflow: 'hidden',
                    clipPath: `inset(0 ${100 - sliderPercent}% 0 0)`,
                    pointerEvents: 'none'
                }}
            >
                <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        src={originalUrl}
                        alt="Original"
                        draggable={false}
                        style={{
                            width: renderOriginal ? renderOriginal.width : '100%',
                            height: renderOriginal ? renderOriginal.height : '100%',
                            objectFit: 'contain',
                            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                            transformOrigin: 'center center',
                            transition: isPanning ? 'none' : 'transform 0.1s'
                        }}
                    />
                </Box>
            </Box>

            {/* Slider Divider (Fixed to Viewport) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${sliderPercent}%`,
                    width: 2,
                    bgcolor: 'white',
                    boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    cursor: 'ew-resize'
                }}
                onMouseDown={handleSliderStart}
                onTouchStart={handleSliderStart}
            >
                {/* Handle */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 2
                    }}
                >
                    <CompareArrowsIcon sx={{ fontSize: 20, color: 'text.primary' }} />
                </Box>
            </Box>

            {/* Labels (Fixed to Viewport) */}
            <Box sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.75rem', pointerEvents: 'none' }}>
                Original
            </Box>
            <Box sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.75rem', pointerEvents: 'none' }}>
                Compressed
            </Box>

            {/* Scale Indicator */}
            <Box
                onClick={(e) => {
                    e.stopPropagation(); // Prevent drag start
                    setTransform({ scale: 1, x: 0, y: 0 });
                }}
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                }}
            >
                {Math.round(transform.scale * 100)}%
            </Box>
        </Paper>
    );
};

export default CompareSlider;
