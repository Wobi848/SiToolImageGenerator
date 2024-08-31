interface KeyEvent {
    generate: string;
    save: string;
    reset: string;
    addButton: string;
    removeButton: string;
    fillAddresses: string;
  }
  
  interface BackgroundLayer {
    y: number;
  }
  
  interface FreeComponent {
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