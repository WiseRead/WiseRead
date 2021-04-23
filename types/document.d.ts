interface HTMLElement  {
  mozRequestFullScreen(): Promise<void>;
  webkitRequestFullscreen(): Promise<void>;
  msRequestFullscreen(): Promise<void>;
}

interface Document {
  mozExitFullScreen(): Promise<void>;
  webkitExitFullscreen(): Promise<void>;
  msExitFullscreen(): Promise<void>;

  cancelFullScreen(): Promise<void>;
  mozCancelFullScreen(): Promise<void>;
  webkitCancelFullScreen(): Promise<void>;

  fullScreenElement: any;
  msFullscreenElement: any;

  mozFullScreen: boolean;
  webkitIsFullScreen: boolean;
}
