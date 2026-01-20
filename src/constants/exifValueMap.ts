export const exifValueMaps: Record<string, Record<number, string>> = {
    Compression: {
        1: 'Uncompressed',
        2: 'CCITT 1D',
        3: 'T4/Group 3 Fax',
        4: 'T6/Group 4 Fax',
        5: 'LZW',
        6: 'JPEG (old-style)',
        7: 'JPEG',
        8: 'Adobe Deflate',
        9: 'JBIG B&W',
        10: 'JBIG Color',
        32766: 'Next',
        32771: 'CCIRLEW',
        32773: 'PackBits',
        32809: 'Thunderscan',
        32895: 'IT8CTPAD',
        32896: 'IT8LW',
        32897: 'IT8MP',
        32898: 'IT8BL',
        32908: 'PixarFilm',
        32909: 'PixarLog',
        32946: 'Deflate',
        32947: 'DCS',
        34661: 'JBIG',
        34676: 'SGILog',
        34677: 'SGILog24',
        34712: 'JPEG 2000',
        34713: 'Nikon NEF Condensed',
        65000: 'Kodak DCR Compressed',
        65535: 'Pentax PEF Compressed',
    },
    Orientation: {
        1: 'Horizontal (normal)',
        2: 'Mirror horizontal',
        3: 'Rotate 180',
        4: 'Mirror vertical',
        5: 'Mirror horizontal and rotate 270 CW',
        6: 'Rotate 90 CW',
        7: 'Mirror horizontal and rotate 90 CW',
        8: 'Rotate 270 CW',
    },
    ExposureProgram: {
        0: 'Not Defined',
        1: 'Manual',
        2: 'Program AE',
        3: 'Aperture-priority AE',
        4: 'Shutter speed priority AE',
        5: 'Creative (Slow speed)',
        6: 'Action (High speed)',
        7: 'Portrait Mode',
        8: 'Landscape Mode',
    },
    MeteringMode: {
        0: 'Unknown',
        1: 'Average',
        2: 'Center-weighted average',
        3: 'Spot',
        4: 'Multi-spot',
        5: 'Multi-segment',
        6: 'Partial',
        255: 'Other',
    },
    LightSource: {
        0: 'Unknown',
        1: 'Daylight',
        2: 'Fluorescent',
        3: 'Tungsten (Incandescent)',
        4: 'Flash',
        9: 'Fine Weather',
        10: 'Cloudy',
        11: 'Shade',
        12: 'Daylight Fluorescent',
        13: 'Day White Fluorescent',
        14: 'Cool White Fluorescent',
        15: 'White Fluorescent',
        17: 'Standard Light A',
        18: 'Standard Light B',
        19: 'Standard Light C',
        20: 'D55',
        21: 'D65',
        22: 'D75',
        23: 'D50',
        24: 'ISO Studio Tungsten',
        255: 'Other',
    },
    Flash: {
        0x0: 'No Flash',
        0x1: 'Fired',
        0x5: 'Fired, Return not detected',
        0x7: 'Fired, Return detected',
        0x9: 'On, Did not fire',
        0xd: 'On, Fired',
        0xf: 'On, Return not detected',
        0x10: 'No Flash function',
        0x18: 'Auto, Did not fire',
        0x19: 'Auto, Fired',
        0x1d: 'Auto, Fired, Return not detected',
        0x1f: 'Auto, Fired, Return detected',
        0x20: 'No flash function',
        0x41: 'Fired, Red-eye reduction',
        0x45: 'Fired, Red-eye reduction, Return not detected',
        0x47: 'Fired, Red-eye reduction, Return detected',
        0x49: 'On, Red-eye reduction',
        0x4d: 'On, Fired, Red-eye reduction',
        0x4f: 'On, Fired, Red-eye reduction, Return not detected',
        0x59: 'Auto, Fired, Red-eye reduction',
        0x5d: 'Auto, Fired, Red-eye reduction, Return not detected',
        0x5f: 'Auto, Fired, Red-eye reduction, Return detected',
    },
    SensingMethod: {
        1: 'Not defined',
        2: 'One-chip color area',
        3: 'Two-chip color area',
        4: 'Three-chip color area',
        5: 'Color sequential area',
        7: 'Trilinear',
        8: 'Color sequential linear',
    },
    SceneCaptureType: {
        0: 'Standard',
        1: 'Landscape',
        2: 'Portrait',
        3: 'Night',
    },
    Contrast: {
        0: 'Normal',
        1: 'Low',
        2: 'High',
    },
    Saturation: {
        0: 'Normal',
        1: 'Low',
        2: 'High',
    },
    Sharpness: {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard',
    },
    SubjectDistanceRange: {
        0: 'Unknown',
        1: 'Macro',
        2: 'Close view',
        3: 'Distant view',
    },
    WhiteBalance: {
        0: 'Auto',
        1: 'Manual',
    },
    ResolutionUnit: {
        1: 'None',
        2: 'inches',
        3: 'cm',
    },
};

const tryRepairEncoding = (str: string): string => {
    // 1. Check if string contains only characters <= 255 (latin1 range)
    // If it has higher code points, it's likely already UTF-8 or another encoding we can't easily guess this way
    let isLatin1 = true;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            isLatin1 = false;
            break;
        }
    }

    if (!isLatin1) return str;

    try {
        // 2. Convert to Uint8Array (treating as binary/latin1)
        const bytes = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }

        // 3. Attempt to decode as UTF-8
        const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);

        // 4. If successful, check if it looks "multibyte-ish" (differs from original)
        // actually if it didn't throw, it IS valid UTF-8.
        // We prefer the decoded version if it's different (meaning bytes were combined)
        // or if we just want to force UTF-8 interpretation.
        return decoded;
    } catch {
        // Decoding failed (invalid UTF-8 sequences), return original
        return str;
    }
};

export const getTagDisplayValue = (tag: string, value: any): string => {
    // If not a number, just return stringified
    if (typeof value !== 'number') {
        if (typeof value === 'object' && value !== null) {
            if (value instanceof Date) return value.toLocaleString();
            return JSON.stringify(value, null, 2);
        }
        // Apply encoding repair for strings
        return tryRepairEncoding(String(value));
    }

    if (exifValueMaps[tag] && exifValueMaps[tag][value]) {
        return `${value} (${exifValueMaps[tag][value]})`;
    }

    // Special case for simple "Yes/No" or basic states if any (omitted for now)

    return String(value);
};
