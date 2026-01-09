
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { getTagDisplayValue } from '../../constants/exifValueMap';
import { getTagHex } from '../../constants/exifTagMap';

interface RightPanelProps {
    t: any;
    exifData: any;
    selectedTag?: string | null;
}

const RightPanel: React.FC<RightPanelProps> = ({ t, exifData, selectedTag }) => {

    // Simple knowledge base for common EXIF tags
    const exifExplanations: Record<string, string> = {
        'Make': 'The manufacturer of the camera.',
        'Model': 'The model number of the camera.',
        'ExposureTime': 'The length of time when the film or digital sensor inside the camera is exposed to light.',
        'FNumber': 'The ratio of the lens\'s focal length to the diameter of the entrance pupil.',
        'ISO': 'The level of sensitivity of your camera to available light.',
        'DateTimeOriginal': 'The date and time when the original image data was generated.',
        'FocalLength': 'The distance between the lens and the image sensor when the subject is in focus.',
        'GPSLatitude': 'The latitude of the location where the photo was taken.',
        'GPSLongitude': 'The longitude of the location where the photo was taken.',
    };



    // Helper to find value in nested or flat structure
    const getTagValue = (data: any, selected: string) => {
        if (!data) return 'N/A';

        // Try parsing composite key "Group:Tag"
        if (selected.includes(':')) {
            const [group, tag] = selected.split(':');
            const groupKey = group.toLowerCase(); // keys in data are lowercase usually (ifd0, exif)

            // Try direct access
            if (data[groupKey] && data[groupKey][tag] !== undefined) {
                return data[groupKey][tag];
            }
            // Try exact group name if case differs
            if (data[group] && data[group][tag] !== undefined) {
                return data[group][tag];
            }
        }

        // Fallback: Check direct property (flat)
        if (data[selected] !== undefined) return data[selected];

        // Fallback: Search in groups (values are objects)
        for (const key of Object.keys(data)) {
            if (data[key] && typeof data[key] === 'object' && data[key][selected] !== undefined) {
                return data[key][selected];
            }
        }
        return 'N/A';
    };

    const getDisplayTitle = (selected: string) => {
        if (selected.includes(':')) {
            const [group, tag] = selected.split(':');
            return `${tag} (${group})`;
        }
        return selected;
    };

    // Extract pure tag name for explanation lookup
    const getTagName = (selected: string) => {
        return selected.includes(':') ? selected.split(':')[1] : selected;
    };

    return (
        <Paper
            elevation={0}
            square
            sx={{
                width: 320,
                height: '100%',
                bgcolor: 'background.paper',
                borderLeft: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>EXIF Guide</Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                {!exifData ? (
                    <Typography variant="body2" color="text.secondary">
                        Select a photo to see detailed explanations of its EXIF data.
                    </Typography>
                ) : selectedTag ? (
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                            {getDisplayTitle(selectedTag)}
                            {(() => {
                                const pureTag = getTagName(selectedTag);
                                // const group = selectedTag.includes(':') ? selectedTag.split(':')[1] : undefined; // Unused
                                const groupName = selectedTag.includes(':') ? selectedTag.split(':')[0] : undefined;

                                const hex = groupName ? getTagHex(groupName, pureTag) : undefined;
                                return hex ? (
                                    <Typography component="span" variant="caption" sx={{ fontFamily: 'monospace', ml: 1, color: 'text.disabled' }}>
                                        {`0x${hex.toString(16).padStart(4, '0')}`}
                                    </Typography>
                                ) : null;
                            })()}
                        </Typography>

                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                                Current Value
                            </Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                {String(getTagDisplayValue(getTagName(selectedTag), getTagValue(exifData, selectedTag)))}
                            </Typography>
                        </Paper>

                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Description
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                            {exifExplanations[getTagName(selectedTag)] || "No standard description available for this tag."}
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Select a row in the table to view details about that specific EXIF tag.
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default RightPanel;
