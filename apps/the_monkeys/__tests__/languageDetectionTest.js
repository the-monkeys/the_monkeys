/**
 * Test script to demonstrate language detection functionality
 */

import {
    detectLanguage,
    extractTextFromBlocks,
    getLanguageFlag,
} from '../src/utils/languageDetection';

// Sample EditorJS blog content in different languages
const testBlogs = [
    {
        title: 'English Blog',
        blocks: [
            {
                type: 'header',
                data: { text: 'Welcome to Our Blog', level: 1 },
            },
            {
                type: 'paragraph',
                data: {
                    text: 'This is a sample blog post written in English. We are excited to share our thoughts and ideas with you.',
                },
            },
            {
                type: 'paragraph',
                data: {
                    text: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet.',
                },
            },
        ],
    },
    {
        title: 'Spanish Blog',
        blocks: [
            {
                type: 'header',
                data: { text: 'Bienvenidos a Nuestro Blog', level: 1 },
            },
            {
                type: 'paragraph',
                data: {
                    text: 'Esta es una publicación de blog de muestra escrita en español. Estamos emocionados de compartir nuestros pensamientos e ideas contigo.',
                },
            },
            {
                type: 'paragraph',
                data: {
                    text: 'El español es un idioma hermoso que se habla en muchos países alrededor del mundo.',
                },
            },
        ],
    },
    {
        title: 'French Blog',
        blocks: [
            {
                type: 'header',
                data: { text: 'Bienvenue sur Notre Blog', level: 1 },
            },
            {
                type: 'paragraph',
                data: {
                    text: "Ceci est un exemple d'article de blog écrit en français. Nous sommes ravis de partager nos pensées et idées avec vous.",
                },
            },
            {
                type: 'paragraph',
                data: {
                    text: 'Le français est une langue romantique parlée dans de nombreux pays à travers le monde.',
                },
            },
        ],
    },
    {
        title: 'German Blog',
        blocks: [
            {
                type: 'header',
                data: { text: 'Willkommen in unserem Blog', level: 1 },
            },
            {
                type: 'paragraph',
                data: {
                    text: 'Dies ist ein Beispiel-Blog-Beitrag, der auf Deutsch geschrieben wurde. Wir freuen uns darauf, unsere Gedanken und Ideen mit Ihnen zu teilen.',
                },
            },
            {
                type: 'paragraph',
                data: {
                    text: 'Deutsch ist eine faszinierende Sprache mit einer reichen Geschichte und Kultur.',
                },
            },
        ],
    },
];

console.log('🌍 Language Detection Test Results:\n');

testBlogs.forEach((blog) => {
    const textContent = extractTextFromBlocks(blog.blocks);
    const detection = detectLanguage(textContent);

    console.log(`📝 ${blog.title}`);
    console.log(`   Text: "${textContent.substring(0, 50)}..."`);
    console.log(
        `   ${getLanguageFlag(detection.code)} Detected: ${detection.name} (${Math.round(detection.confidence * 100)}% confidence)`
    );
    console.log('');
});

console.log('✅ Language detection test completed!');
