interface KeyEvent {
    generate: string;
    save: string;
    reset: string;
    addButton: string;
    removeButton: string;
    fillAddresses: string;
  }
  
  interface BasicSettings {
    name: string;
    width: number;
  }

  interface BackgroundLayer {
    y: number;
  }
  
  interface FreeComponent {
    platform: string;
    version: string;
    comp: number;
    var: number;
    x: number;
    y: number;
    width: number;
    address: string;
    widthElement: number;
    xLabel: number;
    widthLabel: number;
  }