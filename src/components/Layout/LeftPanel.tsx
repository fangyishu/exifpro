import React, { useRef } from 'react';
import { Box, Typography, Paper, Stack, Link, IconButton, Button, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

interface LeftPanelProps {
    onUpload: (files: File[]) => void;
    images?: Array<{ id: string, url: string, name: string, originalUrl?: string }>;
    activeImageId?: string | null;
    onSelectImage?: (id: string) => void;
    onDeleteImage?: (id: string) => void;
    t: any;
    isGlobalDragOver?: boolean;
    onClearAll?: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
    onUpload, images = [], activeImageId, onSelectImage, onDeleteImage, t,
    isGlobalDragOver = false, onClearAll
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isDragOver, setIsDragOver] = React.useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(Array.from(e.target.files));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <Box
            sx={{
                width: 320,
                height: '100%',
                backgroundColor: 'background.paper',
                borderRight: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ p: 2, pt: 6, display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflow: 'hidden' }}>
                {/* Upload Area */}
                <Paper
                    variant="outlined"
                    sx={{
                        p: 4,
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: (isDragOver || isGlobalDragOver) ? 'primary.main' : 'divider',
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: (isDragOver || isGlobalDragOver) ? 'action.hover' : 'background.default',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' }
                    }}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        {t.dragOrClick || 'Drag or click to add'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem', opacity: 0.8 }}>
                        {t.uploadPrivacyNote || 'Operates locally'}
                    </Typography>
                    <input
                        type="file"
                        hidden
                        ref={inputRef}
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                        onChange={handleFileChange}
                    />
                </Paper>

                {/* Batch Controls - Removed */}
                {images.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <Button
                            size="small"
                            onClick={onClearAll}
                            color="error"
                            sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1, textTransform: 'none' }}
                            startIcon={<DeleteSweepIcon />}
                        >
                            {t.clearAll || 'Clear All'}
                        </Button>
                    </Box>
                )}

                <Divider sx={{ mb: 1 }} />

                {/* Gallery Area */}
                {images.length > 0 && (
                    <Box sx={{ flex: 1, overflowY: 'auto' }}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 1
                        }}>
                            {images.map((img) => (
                                <Box
                                    key={img.id}
                                    onClick={() => onSelectImage?.(img.id)}
                                    sx={{
                                        position: 'relative',
                                        paddingTop: '100%', // 1:1 Aspect Ratio
                                        border: 2,
                                        borderColor: activeImageId === img.id ? 'primary.main' : 'transparent',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: activeImageId === img.id ? 'primary.main' : 'divider'
                                        },
                                        '&:hover .delete-btn': { opacity: 1 }
                                    }}
                                >
                                    <img
                                        src={(img as any).originalUrl || img.url}
                                        alt={img.name}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />

                                    {/* Delete Button */}
                                    <Box
                                        className="delete-btn"
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            opacity: 0,
                                            transition: 'opacity 0.2s'
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => onDeleteImage?.(img.id)}
                                            sx={{
                                                bgcolor: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                p: 0.5,
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                            }}
                                        >
                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Footer */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
                <Stack spacing={1} alignItems="flex-start">
                    {/* Hosting */}
                    <Link href="#" target="_blank" rel="noopener" underline="none">
                        <Box
                            component="img"
                            src={`https://img.shields.io/badge/${encodeURIComponent(t.footerHostedOn || 'Hosted_on')}-GitHub_Pages-121013?style=for-the-badge&logo=github&logoColor=white`}
                            alt="GitHub Pages"
                            sx={{ height: 20, display: 'block' }}
                        />
                    </Link>

                    {/* Code Gen */}
                    <Stack direction="row" spacing={0.5}>
                        <Box
                            component="img"
                            src={`https://img.shields.io/badge/${encodeURIComponent(t.footerCodeGen || 'CodeGen')}-Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white`}
                            alt="Antigravity"
                            sx={{ height: 20, display: 'block' }}
                        />
                        <Box
                            component="img"
                            src="https://img.shields.io/badge/AI-Gemini-8E44AD?style=for-the-badge&logo=googlegemini&logoColor=white"
                            alt="Gemini"
                            sx={{ height: 20, display: 'block' }}
                        />
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default LeftPanel;
