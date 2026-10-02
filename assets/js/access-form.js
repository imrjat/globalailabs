// Connect page "Request access" form: inline validation + Formspree submission.
// Set the endpoint via `data-endpoint` on #access-form (https://formspree.io/f/<FORM_ID>).
(function () {
    const form = document.getElementById('access-form');
    if (!form) return;

    const submitBtn = document.getElementById('form-submit');
    const submitLabel = submitBtn ? submitBtn.querySelector('.submit-label') : null;
    const statusEl = document.getElementById('form-status');
    const successEl = document.getElementById('form-success');
    const endpoint = form.dataset.endpoint || form.action;
    const isConfigured = endpoint && !endpoint.includes('YOUR_FORM_ID');

    const fields = [
        { input: document.getElementById('form-name'), messages: { valueMissing: 'Please enter your name.' } },
        { input: document.getElementById('form-company'), messages: { valueMissing: 'Please enter your company.' } },
        {
            input: document.getElementById('form-email'),
            messages: {
                valueMissing: 'Please enter your email.',
                typeMismatch: 'Please enter a valid email, like name@company.com.'
            }
        },
        { input: document.getElementById('form-role'), messages: { valueMissing: 'Please choose what describes you.' } }
    ].filter((f) => f.input);

    fields.forEach((field) => {
        field.error = document.getElementById(`${field.input.id}-error`);
        if (field.error) field.input.setAttribute('aria-describedby', field.error.id);
    });

    function showFieldError(field, message) {
        field.input.setAttribute('aria-invalid', 'true');
        field.input.classList.add('border-[#ff6b9d]');
        if (field.error) {
            field.error.textContent = message;
            field.error.classList.remove('hidden');
        }
    }

    function clearFieldError(field) {
        field.input.removeAttribute('aria-invalid');
        field.input.classList.remove('border-[#ff6b9d]');
        if (field.error) {
            field.error.textContent = '';
            field.error.classList.add('hidden');
        }
    }

    function validateField(field) {
        const v = field.input.validity;
        if (v.valid) {
            clearFieldError(field);
            return true;
        }
        const message = (v.valueMissing && field.messages.valueMissing) ||
            (v.typeMismatch && field.messages.typeMismatch) ||
            field.input.validationMessage;
        showFieldError(field, message);
        return false;
    }

    // Validate on blur; once a field has shown an error, re-check as the user types
    fields.forEach((field) => {
        field.input.addEventListener('blur', () => {
            if (field.input.value !== '') validateField(field);
        });
        const recheck = () => {
            if (field.input.getAttribute('aria-invalid') === 'true') validateField(field);
        };
        field.input.addEventListener('input', recheck);
        field.input.addEventListener('change', recheck);
    });

    function setStatus(type, message) {
        if (!statusEl) return;
        statusEl.className = 'text-sm rounded-[12px] border px-4 py-3';
        if (!type) {
            statusEl.classList.add('hidden');
            statusEl.textContent = '';
            return;
        }
        statusEl.classList.add('border-[#ff6b9d]/40', 'bg-[#ff2e93]/10', 'text-[#ffc2d8]');
        statusEl.textContent = message;
    }

    function setLoading(loading) {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        submitBtn.setAttribute('aria-busy', loading ? 'true' : 'false');
        if (submitLabel) submitLabel.textContent = loading ? 'Sending…' : 'Request access';
    }

    function showSuccess() {
        Array.from(form.children).forEach((child) => {
            if (child !== successEl) child.classList.add('hidden');
        });
        if (successEl) {
            successEl.classList.remove('hidden');
            successEl.classList.add('flex');
            successEl.focus({ preventScroll: true });
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setStatus(null);

        const results = fields.map(validateField);
        const firstInvalid = fields[results.indexOf(false)];
        if (firstInvalid) {
            firstInvalid.input.focus();
            return;
        }

        if (!isConfigured) {
            setStatus('error', "This form isn't connected yet. Please email hello@globalailabs.ai and we'll get you set up.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                form.reset();
                showSuccess();
                return;
            }

            let message = 'Something went wrong sending your request. Please try again.';
            try {
                const data = await response.json();
                if (data && Array.isArray(data.errors) && data.errors.length) {
                    message = data.errors.map((err) => err.message).join(' ');
                }
            } catch (_) { /* non-JSON error body */ }
            setStatus('error', message);
        } catch (_) {
            setStatus('error', "We couldn't reach the server. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    });
})();
