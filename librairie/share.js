// ===== Partage (share) dialog =====
export function initializeShare() {
	const shareBtn = document.getElementById('share-btn');
	const shareDialog = document.getElementById('share-dialog');
	const shareUrlInput = document.getElementById('share-url');
	const copyBtn = document.getElementById('copy-link');
	const closeShare = shareDialog && shareDialog.querySelector('.share-close');
	const waBusinessLink = document.getElementById('share-whatsapp-business');
	const waLink = document.getElementById('share-whatsapp');
	const fbLink = document.getElementById('share-facebook');
	const twLink = document.getElementById('share-twitter');
	const gmailLink = document.getElementById('share-gmail');
	const instagramLink = document.getElementById('share-instagram');
	const googleKeepLink = document.getElementById('share-google-keep');
	const screenshotBtn = document.getElementById('share-screenshot');
	const qrBtn = document.getElementById('share-qr');

	if (!shareBtn || !shareDialog) return;

	function populateLinks(url) {
		const encoded = encodeURIComponent(url);
		const title = document.title || 'DAMAS GLOBAL';
		const encodedTitle = encodeURIComponent(title);
		
		// WhatsApp simple (opens API/web client)
		if (waLink) waLink.href = `https://api.whatsapp.com/send?text=${encoded}`;
		// WhatsApp Business (short wa.me link) — kept for business accounts
		if (waBusinessLink) waBusinessLink.href = `https://wa.me/?text=${encoded}`;
		if (fbLink) fbLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
		if (twLink) twLink.href = `https://twitter.com/intent/tweet?url=${encoded}`;
		if (gmailLink) gmailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodedTitle}&body=${encoded}`;
		if (instagramLink) instagramLink.href = `https://www.instagram.com/`;
		if (googleKeepLink) googleKeepLink.href = `https://keep.google.com/`;
	}

	shareBtn.addEventListener('click', (e) => {
		e.preventDefault();
		const url = window.location.href;
		if (shareUrlInput) shareUrlInput.value = url;
		populateLinks(url);
		try {
			shareDialog.showModal();
		} catch (err) {
			// fallback for browsers that don't support dialog
			shareDialog.style.display = 'block';
		}
	});

	if (closeShare) closeShare.addEventListener('click', () => shareDialog.close());

	if (copyBtn) {
		copyBtn.addEventListener('click', async () => {
			const text = shareUrlInput ? shareUrlInput.value : window.location.href;
			try {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					await navigator.clipboard.writeText(text);
				} else {
					const tmp = document.createElement('textarea');
					tmp.value = text;
					document.body.appendChild(tmp);
					tmp.select();
					document.execCommand('copy');
					document.body.removeChild(tmp);
				}
				copyBtn.textContent = 'Copié';
				setTimeout(() => (copyBtn.textContent = 'Copier'), 1500);
			} catch (err) {
				console.error('Impossible de copier', err);
			}
		});
	}

	// Screenshot functionality
	if (screenshotBtn) {
		screenshotBtn.addEventListener('click', async () => {
			try {
				const canvas = await html2canvas(document.body, {
					allowTaint: true,
					useCORS: true,
					backgroundColor: '#ffffff'
				});
				canvas.toBlob((blob) => {
					const url = URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = `damas-global-${Date.now()}.png`;
					link.click();
					URL.revokeObjectURL(url);
				});
				screenshotBtn.textContent = 'Téléchargé';
				setTimeout(() => (screenshotBtn.textContent = 'Capture d\'écran'), 1500);
			} catch (err) {
				console.error('Erreur capture d\'écran:', err);
				alert('Vérifiez que html2canvas est chargé');
			}
		});
	}

	// QR Code functionality
	if (qrBtn) {
		qrBtn.addEventListener('click', async () => {
			const url = shareUrlInput ? shareUrlInput.value : window.location.href;
			try {
				const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
				const link = document.createElement('a');
				link.href = qrCodeUrl;
				link.download = `qr-code-${Date.now()}.png`;
				link.click();
				qrBtn.textContent = 'Téléchargé';
				setTimeout(() => (qrBtn.textContent = 'Code QR'), 1500);
			} catch (err) {
				console.error('Erreur QR:', err);
			}
		});
	}

	// close when clicking outside (dialog backdrop already handles most cases)
	shareDialog.addEventListener('click', (ev) => {
		const rect = shareDialog.getBoundingClientRect();
		if (ev.clientX < rect.left || ev.clientX > rect.right || ev.clientY < rect.top || ev.clientY > rect.bottom) {
			try { shareDialog.close(); } catch(e) { shareDialog.style.display = 'none'; }
		}
	});
}

