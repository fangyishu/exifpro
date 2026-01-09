import React from 'react';
import { AppBar, Toolbar, Box, Typography, Stack, Divider } from '@mui/material';
import Logo from '../UI/Logo';
import LanguageSelector from '../UI/LanguageSelector';
import AppSwitcher from '../UI/AppSwitcher';
import { translations, TranslationKey } from '../../constants/translations';

interface TopNavBarProps {
    appTitle: string;
    currentLanguage: string;
    onLanguageChange: (lang: string) => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ appTitle, currentLanguage, onLanguageChange }) => {
    return (
        <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Toolbar variant="dense" sx={{ minHeight: 48 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Logo />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                        {appTitle}
                    </Typography>

                    {/* Vertical Divider */}
                    <Divider orientation="vertical" flexItem sx={{ mx: 3, height: 24, alignSelf: 'center', borderColor: 'rgba(255,255,255,0.3)', display: { xs: 'none', md: 'block' } }} />

                    <Typography
                        sx={{
                            opacity: 0.8,
                            display: { xs: 'none', md: 'block' },
                            fontSize: '0.8rem',
                            mt: 0.5
                        }}
                    >
                        {translations[currentLanguage as keyof typeof translations]?.appSlogan}
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <AppSwitcher currentAppId="imagepro" currentLanguage={currentLanguage} />
                    <LanguageSelector
                        currentLanguage={currentLanguage}
                        onLanguageChange={onLanguageChange}
                    />
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavBar;
