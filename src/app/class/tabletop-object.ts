import { ImageFile } from './core/file-storage/image-file';
import { ImageStorage } from './core/file-storage/image-storage';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { ObjectNode } from './core/synchronize-object/object-node';
import { ObjectStore } from './core/synchronize-object/object-store';
import { DataElement } from './data-element';
import { PeerCursor } from './peer-cursor';
import { Player } from './player';
import { RoomAdmin } from './room-admin';

export interface TabletopLocation {
  name: string;
  x: number;
  y: number;
}

export interface imageStyle {
  transformOrigin?:string;
  transform?:string;
  opacity?:string;
  filter?:string;
  transition?:string;
}

@SyncObject('TabletopObject')
export class TabletopObject extends ObjectNode {
  @SyncVar() owner?:string = '';
  @SyncVar() location: TabletopLocation = {
    name: 'table',
    x: 0,
    y: 0
  };

  @SyncVar() posZ: number = 0;
  @SyncVar() isUnite: boolean = false;

  set name(value:string) { this.setCommonValue('name', value); }
  get name(): string { return this.getCommonValue('name', ''); }
  get isVisibleOnTable(): boolean { return this.location.name === 'table'; }

  private _imageFile: ImageFile = ImageFile.Empty;
  private _shadowImageFile: ImageFile = ImageFile.Empty;
  //private _faceIcon: ImageFile = null;
  private _dataElements: { [name: string]: string } = {};

  get ownerName(): string {
    let object = ObjectStore.instance.getObjects<Player>(Player).find(player => player.playerId == this.owner);
     return object ? object.name : '';
  }
  get ownerColor(): string {
    let object = ObjectStore.instance.getObjects<Player>(Player).find(player => player.playerId == this.owner);
    return object ? object.color : '#444444';
  }
  get hasOwner(): boolean { return 0 < this.owner.length; }
  get isMine(): boolean {
    return (PeerCursor.myCursor.player.playerId === this.owner);
  }
  get canTransparent(): boolean {
    return this.isMine || RoomAdmin.canTransparent;
  }
  get canView(): boolean {
    return  !this.hasOwner || this.isMine;
  }

  // GameDataElement getter/setter
  get rootDataElement(): DataElement {
    for (let node of this.children) {
      if (node.getAttribute('name') === this.aliasName) return <DataElement>node;
    }
    return null;
  }

  get imageDataElement(): DataElement { return this.getElement('image'); }
  get commonDataElement(): DataElement { return this.getElement('common'); }
  get detailDataElement(): DataElement { return this.getElement('detail'); }

  auraColor :string[] = ["#000", "#33F", "#3F3", "#3FF", "#F00", "#F0F", "#FF3", "#FFF" ];
  _auraStyle: imageStyle = null;
  get auraStyle():imageStyle {
    if (this._auraStyle === null) this._auraStyle = {};
    this._auraStyle.filter = this.aura != -1 ? 'blur(1px) drop-shadow(0 -4px 4px ' + this.auraColor[this.aura] + ')' : undefined;
    if (this.isInverse) {
      this._auraStyle.transform = 'rotateY(-180deg)';
    }
    else { this._auraStyle.transform = undefined; }
    return this._auraStyle;
  }
  _imgStyle: imageStyle = null;
  get imgStyle():imageStyle {
    if (this._imgStyle === null) this._imgStyle = {};
    let filter:string[] = [];
    if (this.isInverse) {
      this._imgStyle.transform = 'rotateY(-180deg)';
      this._imgStyle.transition = 'transform 132ms 0s ease';
    }
    else {
      this._imgStyle.transform = undefined;
      this._imgStyle.transition = undefined;
     }
    if (this.isHollow) {
      this._imgStyle.opacity = "0.6"
      filter.push('blur(1px)');
    }
    else { this._imgStyle.opacity = undefined; }
    if (this.isBlackPaint) {
      filter.push('brightness(0)');
    }
    if (filter.length > 0) {
      this._imgStyle.filter = filter.join(' ')
    }
    else { this._imgStyle.filter = undefined; }
    return this._imgStyle;
  }

  @SyncVar() currntImageIndex: number = 0;

  get imageElement(): DataElement {
    if (!this.imageDataElement) return null;
    let imageIdElements: DataElement[] = this.imageDataElement.getElementsByName('imageIdentifier');
    return imageIdElements[this.currntImageIndex < 0 ? 0 : this.currntImageIndex >= imageIdElements.length ? imageIdElements.length - 1 : this.currntImageIndex];
  }
  get imageFile(): ImageFile {
    if (!this.imageDataElement) return this._imageFile;
    let imageIdElement = this.imageElement;
    if (imageIdElement && this._imageFile.identifier !== imageIdElement.value) {
      let file: ImageFile = ImageStorage.instance.get(<string>imageIdElement.value);
      this._imageFile = file ? file : ImageFile.Empty;
    }
    return this._imageFile;
  }
  get imageFiles(): ImageFile[] {
    if (!this.imageDataElement) return [];
    let elements = this.imageDataElement.getElementsByName('imageIdentifier');
    return elements.map((element) => {
      let file: ImageFile = ImageStorage.instance.get(<string>element.value);
      return file ? file : null;
    }).filter((file) => { return file != null });
  }

  @SyncVar() isUseIconToOverviewImage: boolean = false;
  @SyncVar() currntIconIndex: number = 0;
  get faceIcon(): ImageFile {
    if (!this.imageDataElement) return null;
    let elements = this.imageDataElement.getElementsByName('faceIcon');
    if (elements) {
      let imageIdElement = elements[this.currntIconIndex];
      if (this.currntIconIndex < 0) this.currntIconIndex = 0;
      return imageIdElement ? ImageStorage.instance.get(<string>imageIdElement.value) : null;
    }
    return null;
  }
  get faceIcons(): ImageFile[] {
    if (!this.imageDataElement) return [];
    let elements = this.imageDataElement.getElementsByName('faceIcon');
    return elements.map((element) => {
      let file: ImageFile = ImageStorage.instance.get(<string>element.value);
      return file ? file : null;
    }).filter((file) => { return file != null });
  }

  get shadowImageFile(): ImageFile {
    if (!this.imageDataElement) return this._shadowImageFile;
    let imageIdElement: DataElement = this.imageDataElement.getFirstElementByName('shadowImageIdentifier');
    if (imageIdElement && this._shadowImageFile.identifier !== imageIdElement.value) {
      let file: ImageFile = ImageStorage.instance.get(<string>imageIdElement.value);
      this._shadowImageFile = file ? file : ImageFile.Empty;
    } else {
      let imageIdElement: DataElement = this.imageElement;
      if (imageIdElement && this._shadowImageFile.identifier !== imageIdElement.currentValue) {
        let file: ImageFile = ImageStorage.instance.get(<string>imageIdElement.currentValue);
        this._shadowImageFile = file ? file : ImageFile.Empty;
      }
    }
    return this._shadowImageFile;
  }

  @SyncVar() isAltitudeIndicate: boolean = false;
  get altitude(): number {
    let element = this.getElement('altitude', this.commonDataElement);
    if (!element && this.commonDataElement) {
      this.commonDataElement.appendChild(DataElement.create('altitude', 0, {}, 'altitude_' + this.identifier));
    }
    let num = element ? +element.value : 0;
    return Number.isNaN(num) ? 0 : num;
  }
  set altitude(altitude: number) {
    let element = this.getElement('altitude', this.commonDataElement);
    if (element) element.value = altitude;
  }

  @SyncVar() isInverse: boolean = false;
  @SyncVar() isHollow: boolean = false;
  @SyncVar() isBlackPaint: boolean = false;
  @SyncVar() aura = -1;

  @SyncVar() isNotRide: boolean = true;
  @SyncVar() isInventoryIndicate: boolean = true;

  protected createDataElements() {
    this.initialize();
    let aliasName: string = this.aliasName;
    if (!this.rootDataElement) {
      let rootElement = DataElement.create(aliasName, '', {}, aliasName + '_' + this.identifier);
      this.appendChild(rootElement);
    }

    if (!this.imageDataElement) {
      this.rootDataElement.appendChild(DataElement.create('image', '', {}, 'image_' + this.identifier));
      this.imageDataElement.appendChild(DataElement.create('imageIdentifier', '', { type: 'image' }, 'imageIdentifier_' + this.identifier));
    }
    if (!this.commonDataElement) this.rootDataElement.appendChild(DataElement.create('common', '', {}, 'common_' + this.identifier));
    if (!this.detailDataElement) this.rootDataElement.appendChild(DataElement.create('detail', '', {}, 'detail_' + this.identifier));
  }

  protected getElement(name: string, from: DataElement = this.rootDataElement): DataElement {
    if (!from) return null;
    let element: DataElement = this._dataElements[name] ? ObjectStore.instance.get(this._dataElements[name]) : null;
    if (!element || !from.contains(element)) {
      element = from.getFirstElementByName(name);
      this._dataElements[name] = element ? element.identifier : null;
    }
    return element;
  }

  protected getCommonValue<T extends string | number>(elementName: string, defaultValue: T): T {
    let element = this.getElement(elementName, this.commonDataElement);
    if (!element) return defaultValue;

    if (typeof defaultValue === 'number') {
      let number: number = +element.value;
      return <T>(Number.isNaN(number) ? defaultValue : number);
    } else {
      return <T>(element.value + '');
    }
  }

  getUrls(): DataElement[] {
    return this.rootDataElement.getElementsByType('url');
  }

  protected setCommonValue(elementName: string, value: any) {
    let element = this.getElement(elementName, this.commonDataElement);
    if (!element) { return; }
    element.value = value;
  }

  protected getImageFile(elementName: string) {
    if (!this.imageDataElement) return null;
    let image = this.getElement(elementName, this.imageDataElement);
    return image ? ImageStorage.instance.get(<string>image.value) : null;
  }

  protected setImageFile(elementName: string, imageFile: ImageFile) {
    let image = imageFile ? this.getElement(elementName, this.imageDataElement) : null;
    if (!image) return;
    image.value = imageFile.identifier;
  }

  setLocation(location: string) {
    this.location.name = location;
    this.update();
  }
}
