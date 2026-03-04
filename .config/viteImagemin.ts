export default {
    gifsicle: {
        optimizationLevel: 7,
        interlaced: true
    },
    optipng: {
        optimizationLevel: 7
    },
    mozjpeg: {
        quality: 85,
        progressive: true
    },
    pngquant: {
        quality: [0.85, 0.95],
        speed: 3
    },
    svgo: {
        plugins: [
            {
                name: 'removeViewBox'
            },
            {
                name: 'removeEmptyAttrs',
                active: false
            },
            {
                name: 'cleanupIds',
                active: true
            }
        ]
    },
}