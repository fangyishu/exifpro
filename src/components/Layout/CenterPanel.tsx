
import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, CircularProgress, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import Tooltip from '@mui/material/Tooltip';
import { getTagHex } from '../../constants/exifTagMap';
import { getTagDisplayValue } from '../../constants/exifValueMap';

interface CenterPanelProps {
    activeImage: any;
    exifData: any;
    loading?: boolean;
    selectedTag?: string | null;
    onSelectTag?: (tag: string) => void;
}

const CenterPanel: React.FC<CenterPanelProps> = ({ activeImage, exifData, loading, selectedTag, onSelectTag }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

    const handleToggleGroup = (groupName: string) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev);
            if (next.has(groupName)) {
                next.delete(groupName);
            } else {
                next.add(groupName);
            }
            return next;
        });
    };

    // Process data to groups
    // If MergeOutput is false, exifData is { ifd0: {...}, exif: {...} }
    // If it's a flat object (fallback or error msg), handle it gracefully
    const processedGroups = React.useMemo(() => {
        if (!exifData || !activeImage) return [];
        const groups: { name: string, items: [string, any][] }[] = [];

        // Check if it's already grouped (keys likely match IFD names or lowercase variants)
        // exifr keys are usually: ifd0, ifd1, exif, gps, interop, etc.
        const potentialGroups = ['ifd0', 'ifd1', 'exif', 'gps', 'interop', 'xmp', 'icc', 'iptc'];
        const isGrouped = Object.keys(exifData).some(k => potentialGroups.includes(k.toLowerCase()) && typeof exifData[k] === 'object');

        if (isGrouped) {
            Object.entries(exifData).forEach(([groupName, groupData]) => {
                if (groupName === 'thumbnail' || !groupData || typeof groupData !== 'object') return;

                const items = Object.entries(groupData as object).filter(([key, value]) => {
                    if (key === 'thumbnail' || value instanceof Uint8Array) return false;
                    // Filter by search
                    if (!searchQuery) return true;
                    const searchLower = searchQuery.toLowerCase();
                    const valueString = typeof value === 'object' ? JSON.stringify(value) : String(value);
                    return key.toLowerCase().includes(searchLower) || valueString.toLowerCase().includes(searchLower);
                });

                if (items.length > 0) {
                    groups.push({ name: groupName.toUpperCase(), items: items as [string, any][] });
                }
            });
        } else {
            // Fallback for flat structure OR generic properties
            const items = Object.entries(exifData).filter(([key, value]) => {
                if (key === 'thumbnail' || value instanceof Uint8Array) return false;
                if (!searchQuery) return true;
                const searchLower = searchQuery.toLowerCase();
                const valueString = typeof value === 'object' ? JSON.stringify(value) : String(value);
                return key.toLowerCase().includes(searchLower) || valueString.toLowerCase().includes(searchLower);
            });
            if (items.length > 0) {
                groups.push({ name: 'General', items: items as [string, any][] });
            }
        }

        // Sort groups based on standard EXIF order
        const order = ['IFD0', 'IFD1', 'EXIF', 'GPS', 'INTEROP', 'XMP', 'IPTC', 'ICC', 'THUMBNAIL'];
        groups.sort((a, b) => {
            const indexA = order.indexOf(a.name);
            const indexB = order.indexOf(b.name);

            // If both are known, sort by index
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // If only A is known, it comes first
            if (indexA !== -1) return -1;
            // If only B is known, it comes first
            if (indexB !== -1) return 1;
            // Otherwise alphabetical
            return a.name.localeCompare(b.name);
        });

        return groups;
    }, [exifData, searchQuery, activeImage]);

    if (!activeImage) {
        return (
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f5f5', color: 'text.secondary', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6">Select an image to view EXIF data</Typography>
            </Box>
        );
    }


    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5', overflow: 'hidden', p: 0 }}>
            <Grid container sx={{ height: '100%' }}>
                <Grid size={{ xs: 12 }} sx={{ height: '100%', overflow: 'hidden' }}>
                    <Paper elevation={0} sx={{ height: '100%', overflow: 'hidden', borderRadius: 0, display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
                        {loading ? (
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                <CircularProgress size={24} />
                                <Typography color="text.secondary">Reading EXIF...</Typography>
                            </Box>
                        ) : exifData ? (
                            <>
                                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search EXIF tags..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: searchQuery ? (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="clear search"
                                                        onClick={() => setSearchQuery('')}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        }}
                                        variant="outlined"
                                    />
                                </Box>
                                <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fafafa', width: '40%' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Tooltip title="Collapse All">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const allGroups = processedGroups.map(g => g.name);
                                                                    setCollapsedGroups(new Set(allGroups));
                                                                }}
                                                                sx={{ p: 0.5 }}
                                                            >
                                                                <UnfoldLessIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        Tag
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fafafa' }}>Value</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {processedGroups.length > 0 ? (
                                                processedGroups.map((group) => {
                                                    const groupDescriptions: Record<string, string> = {
                                                        'IFD0': 'Main Image Metadata',
                                                        'IFD1': 'Thumbnail Metadata',
                                                        'EXIF': 'Photo Capture Parameters',
                                                        'GPS': 'Location Data',
                                                        'INTEROP': 'Interoperability',
                                                        'XMP': 'Extensible Metadata',
                                                        'IPTC': 'IPTC Metadata',
                                                        'ICC': 'Color Profile',
                                                        'THUMBNAIL': 'Thumbnail Data',
                                                        'DC': 'Dublin Core (XMP)',
                                                        'PHOTOSHOP': 'Photoshop (XMP)',
                                                        'TIFF': 'TIFF Tags'
                                                    };

                                                    const groupDisplayNames: Record<string, string> = {
                                                        'DC': 'XMP-DC',
                                                        'PHOTOSHOP': 'XMP-Photoshop',
                                                    };

                                                    return (
                                                        <React.Fragment key={group.name}>
                                                            {/* Section Header */}
                                                            <TableRow
                                                                sx={{ bgcolor: '#e0e0e0', cursor: 'pointer' }}
                                                                onClick={() => handleToggleGroup(group.name)}
                                                                hover
                                                            >
                                                                <TableCell colSpan={2} sx={{ fontWeight: 'bold', textTransform: 'uppercase', py: 0.75, fontSize: '0.75rem', color: 'text.secondary', bgcolor: '#f0f0f0' }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <IconButton size="small" sx={{ mr: 1, p: 0 }}>
                                                                            {collapsedGroups.has(group.name) ? <KeyboardArrowRightIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                                                                        </IconButton>
                                                                        {groupDisplayNames[group.name] || group.name}
                                                                        {groupDescriptions[group.name] && (
                                                                            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', fontWeight: 'normal', textTransform: 'none', fontStyle: 'italic' }}>
                                                                                ({groupDescriptions[group.name]})
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            {/* Items */}
                                                            {!collapsedGroups.has(group.name) && group.items.map(([key, value]) => {
                                                                const hexCode = getTagHex(group.name, key);
                                                                const hexString = hexCode !== undefined ? `0x${hexCode.toString(16).padStart(4, '0')}` : undefined;
                                                                const compositeKey = `${group.name}:${key}`;
                                                                return (
                                                                    <TableRow
                                                                        key={compositeKey}
                                                                        hover
                                                                        selected={selectedTag === compositeKey}
                                                                        onClick={() => onSelectTag && onSelectTag(compositeKey)}
                                                                        sx={{ cursor: 'pointer' }}
                                                                    >
                                                                        <TableCell component="th" scope="row" sx={{ color: 'text.primary', fontWeight: 500, pl: 5 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                {hexString && (
                                                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled', mr: 1, fontSize: '0.7rem' }}>
                                                                                        {hexString}
                                                                                    </Typography>
                                                                                )}
                                                                                {groupDisplayNames[group.name] || group.name}:{key}
                                                                            </Box>
                                                                        </TableCell>
                                                                        <TableCell sx={{ wordBreak: 'break-all', color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                                                                            {getTagDisplayValue(key, value)}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                        </React.Fragment>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                                        No matching tags found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <Typography>No EXIF data found.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CenterPanel;
