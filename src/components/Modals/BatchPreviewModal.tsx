import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageComparisonView from '../Common/ImageComparisonView';

interface BatchPreviewModalProps {
    open: boolean;
    onClose: () => void;
    image: {
        id: string;
        url: string;
        name: string;
        originalMeta?: { width: number; height: number; size: number; type?: string };
        currentMeta?: { width: number; height: number; size: number };
    } | null;
    globalSettings: {
        width?: number;
        height?: number;
        format: 'jpg' | 'png' | 'webp';
        quality: number;
    };
}

const BatchPreviewModal: React.FC<BatchPreviewModalProps> = ({ open, onClose, image, globalSettings }) => {
    if (!image) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    maxHeight: '90vh',
                    bgcolor: '#1e1e1e',
                    color: 'white'
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                    Preview: {image.name}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#121212', p: 0, height: '80vh' }}>
                <ImageComparisonView
                    originalUrl={image.url}
                    originalMeta={image.originalMeta}
                    settings={globalSettings}
                />
            </DialogContent>
        </Dialog>
    );
};

export default BatchPreviewModal;
