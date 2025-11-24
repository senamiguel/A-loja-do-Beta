// ES6 module for contact form behavior
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

const CONTACT_KEY = 'contactMessages';

const minMessageLength = 10;

const isValidEmail = (email) => {
    // Simple RFC-inspired but lightweight email check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const loadSavedMessages = () => {
    try {
        const raw = localStorage.getItem(CONTACT_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (err) {
        console.warn('Could not parse saved messages', err);
        return [];
    }
};

const saveMessage = (payload) => {
    const items = loadSavedMessages();
    items.push(payload);
    localStorage.setItem(CONTACT_KEY, JSON.stringify(items));
};

const setSavedCount = () => {
    const el = qs('#savedCount');
    if (!el) return;
    el.textContent = loadSavedMessages().length;
};

const showAlert = (type = 'success', text = '', duration = 3500) => {
    const wrap = qs('#formAlert');
    if (!wrap) return;
    wrap.classList.remove('d-none', 'alert-danger', 'alert-success', 'alert-warning');
    wrap.classList.add(type === 'success' ? 'alert-success' : (type === 'warning' ? 'alert-warning' : 'alert-danger'));
    wrap.textContent = text;

    // remove after duration
    if (duration > 0) {
        setTimeout(() => {
            wrap.classList.add('d-none');
        }, duration);
    }
};

const resetValidation = (form) => {
    qsa('.is-invalid, .is-valid', form).forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });
};

const validateForm = (data) => {
    const errors = {};

    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Por favor, informe seu nome.';
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Informe um e-mail válido.';
    }

    if (!data.subject || data.subject.trim().length === 0) {
        errors.subject = 'O assunto não pode ficar vazio.';
    }

    if (!data.message || data.message.trim().length < minMessageLength) {
        errors.message = `Escreva uma mensagem com pelo menos ${minMessageLength} caracteres.`;
    }

    return errors;
};

document.addEventListener('DOMContentLoaded', () => {
    const form = qs('#contactForm');
    if (!form) return;

    const nameEl = qs('#name', form);
    const emailEl = qs('#email', form);
    const subjectEl = qs('#subject', form);
    const messageEl = qs('#message', form);
    const submitBtn = qs('#submitBtn', form);
    const resetBtn = qs('#resetBtn', form);

    // initialize counter
    setSavedCount();

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        resetValidation(form);

        const payload = {
            name: nameEl.value.trim(),
            email: emailEl.value.trim(),
            subject: subjectEl.value.trim(),
            message: messageEl.value.trim(),
            createdAt: new Date().toISOString()
        };

        const errors = validateForm(payload);
        // mark fields
        if (errors.name) nameEl.classList.add('is-invalid'); else nameEl.classList.add('is-valid');
        if (errors.email) emailEl.classList.add('is-invalid'); else emailEl.classList.add('is-valid');
        if (errors.subject) subjectEl.classList.add('is-invalid'); else subjectEl.classList.add('is-valid');
        if (errors.message) messageEl.classList.add('is-invalid'); else messageEl.classList.add('is-valid');

        if (Object.keys(errors).length) {
            const first = Object.values(errors)[0];
            showAlert('danger', first, 4000);
            return;
        }

        // simulate sending
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';

        try {
            // simulated network delay
            await new Promise(r => setTimeout(r, 700));

            // Save to localStorage
            saveMessage(payload);

            // reset form visually
            form.reset();
            resetValidation(form);
            showAlert('success', 'Mensagem enviada com sucesso. Obrigado — retornaremos em breve!', 5000);
            setSavedCount();
        } catch (err) {
            console.error('Failed to save message', err);
            showAlert('danger', 'Ocorreu um erro ao enviar. Tente novamente mais tarde.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    resetBtn.addEventListener('click', () => {
        resetValidation(form);
        qs('#formAlert').classList.add('d-none');
    });
});

// also export utilities for testing if imported elsewhere
export { loadSavedMessages, saveMessage, validateForm };
