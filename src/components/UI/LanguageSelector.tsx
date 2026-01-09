import React, { useState } from 'react';
import { Button, Popover, Box, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';

interface LanguageSelectorProps {
    currentLanguage: string;
    onLanguageChange: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (code: string) => {
        onLanguageChange(code);
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'language-popover' : undefined;

    const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);
    const displayName = selectedLang ? selectedLang.name : 'English';

    return (
        <>
            <Button
                aria-describedby={id}
                onClick={handleClick}
                startIcon={<LanguageIcon sx={{ fontSize: '1rem' }} />}
                sx={{
                    color: 'white',
                    textTransform: 'none',
                    minWidth: 'auto',
                    padding: '4px 6px',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                }}
                size="small"
            >
                <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 0 }}>
                    {displayName}
                </Typography>
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
                        p: 2,
                        width: 300, // Reduced width as requested (approx 60% of previous 460)
                        backgroundColor: '#ffffff',
                        color: 'text.primary',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                        borderRadius: 2
                    }
                }}
            >
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1
                }}>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <Box
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            sx={{
                                p: 1,
                                px: 1.5,
                                height: 40, // Fixed height for consistency
                                borderRadius: 1,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: currentLanguage === lang.code ? '#e3f2fd' : 'transparent',
                                color: currentLanguage === lang.code ? '#1976d2' : 'text.primary',
                                '&:hover': {
                                    backgroundColor: currentLanguage === lang.code ? '#e3f2fd' : '#f5f5f5'
                                },
                                transition: 'all 0.2s',
                                border: currentLanguage === lang.code ? '1px solid rgba(25, 118, 210, 0.1)' : '1px solid transparent'
                            }}
                        >
                            <Typography variant="body2" sx={{
                                fontSize: '0.875rem',
                                fontWeight: currentLanguage === lang.code ? 600 : 400,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {lang.name}
                            </Typography>
                            {currentLanguage === lang.code && (
                                <CheckIcon sx={{ fontSize: '1rem', color: '#1976d2', ml: 1 }} />
                            )}
                        </Box>
                    ))}
                </Box>
            </Popover>
        </>
    );
};

export default LanguageSelector;
