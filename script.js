console.log("Hello world!");

const handleSecretCopy = (button) => {
	const value = button.getAttribute("data-copy-value");
	if (!value) {
		return;
	}

	const idleLabel = button.dataset.labelIdle || button.getAttribute("aria-label") || "Copy to clipboard";
	const copiedLabel = button.dataset.labelCopied || "Copied";
	const errorLabel = button.dataset.labelError || "Copy failed";

	const setState = (state, label) => {
		button.setAttribute("data-state", state);
		if (label) {
			button.setAttribute("aria-label", label);
		}
	};

	const clearPendingReset = () => {
		if (button.__yasminaResetTimer) {
			clearTimeout(button.__yasminaResetTimer);
			button.__yasminaResetTimer = null;
		}
	};

	const resetState = () => {
		clearPendingReset();
		button.__yasminaResetTimer = setTimeout(() => {
			setState("idle", idleLabel);
			clearPendingReset();
		}, 2000);
	};

	const handleSuccess = () => {
		setState("copied", copiedLabel);
		resetState();
	};

	const handleFailure = () => {
		setState("error", errorLabel);
		resetState();
	};

	clearPendingReset();

	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(value).then(handleSuccess).catch(handleFailure);
		return;
	}

	// Fallback for browsers without navigator.clipboard.
	const tempInput = document.createElement("input");
	tempInput.value = value;
	document.body.appendChild(tempInput);
	tempInput.select();

	try {
		const copied = document.execCommand("copy");
		if (copied) {
			handleSuccess();
		} else {
			handleFailure();
		}
	} catch (error) {
		handleFailure();
	}

	document.body.removeChild(tempInput);
};

const activateTryTab = (tab) => {
	const target = tab.getAttribute("data-try-target");
	if (!target) {
		return;
	}

	const container = tab.closest(".yasmina-try");
	if (!container) {
		return;
	}

	const tabs = container.querySelectorAll(".yasmina-try-tab");
	const panels = container.querySelectorAll(".yasmina-try-panel");

	tabs.forEach((candidate) => {
		const isActive = candidate === tab;
		candidate.classList.toggle("is-active", isActive);
		candidate.setAttribute("aria-selected", isActive ? "true" : "false");
	});

	panels.forEach((panel) => {
		const isActive = panel.getAttribute("data-try-id") === target;
		panel.classList.toggle("is-active", isActive);
		panel.setAttribute("aria-hidden", isActive ? "false" : "true");
		if (isActive) {
			panel.setAttribute("aria-labelledby", tab.id || "");
		}
	});
};

document.addEventListener("click", (event) => {
	const copyButton = event.target.closest(".yasmina-secret-copy");
	if (copyButton) {
		handleSecretCopy(copyButton);
		return;
	}

	const tryTab = event.target.closest(".yasmina-try-tab");
	if (tryTab) {
		activateTryTab(tryTab);
	}
});