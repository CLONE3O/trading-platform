// Simple i18n loader
const translations = {};
let currentLang = 'en';

function loadLanguage(lang) {
    fetch(`i18n/${lang}.json`)
        .then(res => res.json())
        .then(dict => {
            translations[lang] = dict;
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) el.innerText = dict[key];
            });
        });
}

document.getElementById('languageSwitcher').addEventListener('change', (e) => {
    currentLang = e.target.value;
    loadLanguage(currentLang);
});

window.addEventListener('DOMContentLoaded', () => {
    loadLanguage(currentLang);
});