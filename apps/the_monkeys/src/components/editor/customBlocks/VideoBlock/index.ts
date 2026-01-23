export default class VideoTool {
    data: { url: string; title: string, fileName?: string };
    api: any;
    config: any;
    wrapper: HTMLElement;
    readOnly: boolean;

    constructor({ data, config, api, readOnly }: { data?: { url: string, title: string, fileName?: string }, config?: any, api: any, readOnly?: boolean }) {
        this.api = api;
        this.config = config;
        this.data = data || { url: '', title: '', fileName: '' };
        this.readOnly = !!readOnly;
        this.wrapper = document.createElement('div');
    }

    static get isReadOnlySupported() {
        return true;
    }

    static get toolbox() {
        return {
            title: 'Video',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="2" y1="7" x2="2" y2="7"/><line x1="2" y1="13" x2="2" y2="13"/><line x1="22" y1="7" x2="22" y2="7"/><line x1="22" y1="13" x2="22" y2="13"/><path d="M10 21l2-2 2 2"/></svg>'
        };
    }

    render() {
        this.wrapper.classList.add('video-tool-wrapper');

        if (this.data.url) {
            this.showPlayer();
        } else if (!this.readOnly) {
            this.showInput();
        } else {
            this.wrapper.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">No video provided</div>';
        }

        return this.wrapper;
    }

    showInput() {
        this.wrapper.innerHTML = '';
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.border = '1px dashed #ccc';
        container.style.textAlign = 'center';
        container.style.backgroundColor = '#f9f9f9';
        container.style.borderRadius = '8px';

        const button = document.createElement('button');
        button.innerText = 'Upload Video';
        button.classList.add('cdx-button');

        button.onclick = (e: any) => {
            e.preventDefault();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.onchange = async (e: any) => {
                const file = e.target.files[0];
                if (file && this.config.uploader) {
                    button.innerText = 'Uploading...';
                    try {
                        const result = await this.config.uploader(file);
                        if (result.success) {
                            this.data = {
                                url: result.file.url,
                                title: file.name,
                                fileName: result.file.name
                            };
                            this.showPlayer();
                        } else {
                            button.innerText = 'Upload Failed';
                        }
                    } catch (err) {
                        button.innerText = 'Upload Error';
                    }
                }
            };
            input.click();
        };

        container.appendChild(button);
        this.wrapper.appendChild(container);
    }

    async showPlayer() {
        this.wrapper.innerHTML = '';
        if (!this.data.url) return;

        let finalUrl = this.data.url;

        // Auto-resolve if it's a Storage V2 proxy URL
        if (finalUrl.includes('/storage/posts/') && finalUrl.endsWith('/url')) {
            try {
                const res = await fetch(finalUrl);
                const data = await res.json();
                if (data && data.url) {
                    finalUrl = data.url;
                }
            } catch (err) {
                console.error('Failed to resolve Video URL:', err);
            }
        }

        const videoElement = document.createElement('video');
        videoElement.src = finalUrl;
        videoElement.controls = true;
        videoElement.style.width = '100%';
        videoElement.style.maxHeight = '500px';
        videoElement.style.borderRadius = '8px';
        videoElement.style.backgroundColor = '#000';

        this.wrapper.appendChild(videoElement);
    }

    save() {
        return this.data;
    }

    removed() {
        if (this.data.fileName && this.config.onRemove) {
            this.config.onRemove(this.data.fileName).catch((err: any) => {
                console.error('Failed to remove video from storage:', err);
            });
        }
    }
}
