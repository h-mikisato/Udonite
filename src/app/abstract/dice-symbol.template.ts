import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ObjectNode } from '@udonarium/core/synchronize-object/object-node';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem } from '@udonarium/core/system';
import { StringUtil } from '@udonarium/core/system/util/string-util';
import { DiceSymbol } from '@udonarium/dice-symbol';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { GameCharacterSheetComponent } from 'component/game-character-sheet/game-character-sheet.component';
import { OpenUrlComponent } from 'component/open-url/open-url.component';
import { InputHandler } from 'directive/input-handler';
import { MovableOption } from 'directive/movable.directive';
import { RotableOption } from 'directive/rotable.directive';
import { ContextMenuAction, ContextMenuSeparator, ContextMenuService } from 'service/context-menu.service';
import { ModalService } from 'service/modal.service';
import { ImageService } from 'service/image.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PlayerService } from 'service/player.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { ChatMessageService } from 'service/chat-message.service';

@Component({
  selector: 'dice-symbol-template',
  template: `<div></div>`
})
export class DiceSymbolComponentTemplate implements OnInit, AfterViewInit, OnDestroy {
  diceSymbol: DiceSymbol = null;
  is3D: boolean = false;

  get face(): string { return this.diceSymbol.face; }
  set face(face: string) { this.diceSymbol.face = face; }
  get owner(): string { return this.diceSymbol.owner; }
  set owner(owner: string) { this.diceSymbol.owner = owner; }
  get rotate(): number { return this.diceSymbol.rotate; }
  set rotate(rotate: number) { this.diceSymbol.rotate = rotate; }

  get name(): string { return this.diceSymbol.name; }
  set name(name: string) { this.diceSymbol.name = name; }
  get size(): number { return this.adjustMinBounds(this.diceSymbol.size); }

  get faces(): string[] { return this.diceSymbol.faces; }
  get nothingFaces(): string[] { return this.diceSymbol.nothingFaces; }
  get imageFile(): ImageFile {
    return this.imageService.getEmptyOr(this.diceSymbol.imageFile);
  }
  get backFaceImageFile(): ImageFile {
    return this.imageService.getEmptyOr(this.diceSymbol.backFaceImageFile);
  }

  get isMine(): boolean { return this.diceSymbol.isMine; }
  get hasOwner(): boolean { return this.diceSymbol.hasOwner; }
  get ownerName(): string { return this.diceSymbol.ownerName; }
  get ownerColor(): string { return this.diceSymbol.ownerColor; }
  get canTransparent(): boolean { return  this.hasOwner && this.diceSymbol.canTransparent}
  get isVisible(): boolean { return this.diceSymbol.isVisible; }

  get isDropShadow(): boolean { return this.diceSymbol.isDropShadow; }
  set isDropShadow(isDropShadow: boolean) { this.diceSymbol.isDropShadow = isDropShadow; }

  get isLock(): boolean { return this.diceSymbol.isLock; }
  set isLock(isLock: boolean) { this.diceSymbol.isLock = isLock; }

  get isCoin(): boolean { return this.diceSymbol.isCoin; }

  animeState: string = 'inactive';

  private iconHiddenTimer: NodeJS.Timer = null;
  get isIconHidden(): boolean { return this.iconHiddenTimer != null };

  gridSize: number = 50;

  movableOption: MovableOption = {};
  rotableOption: RotableOption = {};

  private doubleClickTimer: NodeJS.Timer = null;
  private doubleClickPoint = { x: 0, y: 0 };

  private input: InputHandler = null;

  viewRotateX = 50;
  viewRotateZ = 10;

  get nameTagRotate(): number {
    let x = (this.viewRotateX % 360) - 90;
    let z = (this.viewRotateZ + this.rotate) % 360;
    z = (z > 0 ? z : 360 + z);
    return (x > 0 ? x : 360 + x) * (this.isFlip ? 1 : -1);
  }

  get isFlip(): boolean {
    let z = (this.viewRotateZ + this.rotate) % 360;
    z = (z > 0 ? z : 360 + z);
    return 90 < z && z < 270;
  }

  constructor(
    private ngZone: NgZone,
    private panelService: PanelService,
    private contextMenuService: ContextMenuService,
    private elementRef: ElementRef<HTMLElement>,
    private changeDetector: ChangeDetectorRef,
    private pointerDeviceService: PointerDeviceService,
    private playerService: PlayerService,
    private imageService: ImageService,
    private modalService: ModalService,
    private chatMessageService: ChatMessageService
  ) { }

  ngOnInit() {
    EventSystem.register(this)
      .on('ROLL_DICE_SYNBOL', -1000, event => {
        if (event.data.identifier === this.diceSymbol.identifier) {
          this.ngZone.run(() => {
            this.animeState = 'inactive';
            this.changeDetector.markForCheck();
            setTimeout(() => { this.animeState = 'active'; this.changeDetector.markForCheck(); });
          });
        }
      })
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        let object = ObjectStore.instance.get(event.data.identifier);
        if (!this.diceSymbol || !object) return;
        if ((this.diceSymbol === object)
          || (object instanceof ObjectNode && this.diceSymbol.contains(object))) {
          this.changeDetector.markForCheck();
        }
      })
      .on('DICE_ALL_OPEN', -1000, event => {
        if (this.owner && !this.isLock) {
          this.owner = '';
          SoundEffect.play(PresetSound.unlock);
          this.chatMessageService.sendOperationLog(`${this.diceSymbol.name} の${this.isCoin ? '表／裏' : '目'}を公開 → ${this.face}`,"dice");
        }
      })
      .on<object>('TABLE_VIEW_ROTATE', -1000, event => {
        this.ngZone.run(() => {
          this.viewRotateX = event.data['x'];
          this.viewRotateZ = event.data['z'];
          this.changeDetector.markForCheck();
        });
      })
      .on('IMAGE_SYNC', -1000, event => {
        this.changeDetector.markForCheck();
      });
    this.movableOption = {
      tabletopObject: this.diceSymbol,
      transformCssOffset: 'translateZ(1.0px)',
      colideLayers: ['terrain', 'text-note', 'character']
    };
    this.rotableOption = {
      tabletopObject: this.diceSymbol
    };
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.input = new InputHandler(this.elementRef.nativeElement);
    });
    this.input.onStart = e => this.ngZone.run(() => this.onInputStart(e));
  }

  ngOnDestroy() {
    this.input.destroy();
    EventSystem.unregister(this);
  }

  @HostListener('dragstart', ['$event'])
  onDragstart(e: any) {
    e.stopPropagation();
    e.preventDefault();
  }

  animationShuffleDone(event: any) {
    this.animeState = 'inactive';
    this.changeDetector.markForCheck();
  }

  onInputStart(e: MouseEvent | TouchEvent) {
    this.startDoubleClickTimer(e);
    this.startIconHiddenTimer();
  }

  startDoubleClickTimer(e) {
    if (!this.doubleClickTimer) {
      this.stopDoubleClickTimer();
      this.doubleClickTimer = setTimeout(() => this.stopDoubleClickTimer(), e.touches ? 500 : 300);
      this.doubleClickPoint = this.input.pointer;
      return;
    }

    if (e.touches) {
      this.input.onEnd = this.onDoubleClick.bind(this);
    } else {
      this.onDoubleClick();
    }
  }

  stopDoubleClickTimer() {
    clearTimeout(this.doubleClickTimer);
    this.doubleClickTimer = null;
    this.input.onEnd = null;
  }

  onDoubleClick() {
    this.stopDoubleClickTimer();
    let distance = (this.doubleClickPoint.x - this.input.pointer.x) ** 2 + (this.doubleClickPoint.y - this.input.pointer.y) ** 2;
    if (distance < 10 ** 2) {
      if (this.isVisible) this.diceRoll();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;
    let position = this.pointerDeviceService.pointers[0];

    let actions: ContextMenuAction[] = [];

    //if (this.isVisible) {
      actions.push({
        name: this.isCoin ? 'コイントス' : 'ダイスを振る', action: () => {
          this.diceRoll();
        },
        disabled: !this.isVisible,
        default: this.isVisible
      });
    //}
    actions.push(ContextMenuSeparator);
    if (this.isMine || this.hasOwner) {
      actions.push({
        name: `${this.isCoin ? 'コイン' : 'ダイス'}を公開`, action: () => {
          this.owner = '';
          SoundEffect.play(PresetSound.unlock);
          this.chatMessageService.sendOperationLog(`${this.diceSymbol.name} の${this.isCoin ? '表／裏' : '目'}を公開 → ${this.face}`,"dice");
        }
      });
    }
    if (!this.isMine) {
      actions.push({
        name: `${this.isCoin ? 'コイン' : 'ダイス'}を伏せる`, action: () => {
          this.owner = this.playerService.myPlayer.playerId;;
          this.chatMessageService.sendOperationLog(`${this.diceSymbol.name} を伏せた`,"dice");
          SoundEffect.play(PresetSound.lock);
        }
      });
    }
    actions.push((this.isLock
      ? {
        name: '☑ 一斉公開しない', action: () => {
          this.isLock = false;
          SoundEffect.play(PresetSound.unlock);
        }
      } : {
        name: '☐ 一斉公開しない', action: () => {
          this.isLock = true;
          SoundEffect.play(PresetSound.lock);
        }
      }));
    if (this.isVisible) {
      let subActions: ContextMenuAction[] = [];
      let nothingFaces = this.nothingFaces;
      if (nothingFaces.length > 0) {
        nothingFaces.forEach(face => {
          subActions.push({
            name: `${this.face == face ? '◉' : '○'} ${face}　`, action: () => {
              SoundEffect.play(PresetSound.dicePut);
              this.face = face;
            }
          });
        });
        subActions.push(ContextMenuSeparator);
      }
      this.faces.forEach(face => {
        subActions.push({
          name: `${this.face == face ? '◉' : '○'} ${face}　`, action: () => {
            SoundEffect.play(PresetSound.dicePut);
            if (this.owner === '' && this.face != face) this.chatMessageService.sendOperationLog(`${this.diceSymbol.name} の${this.isCoin ? '表／裏' : '目'}を変更 → ${face}`,"dice");
            if (this.owner !== '' && this.face != face) this.chatMessageService.sendOperationLog(`${this.diceSymbol.name} の${this.isCoin ? '表／裏' : '目'}を変更`,"dice");
            this.face = face;
          }
        });
      });
      actions.push({ name: this.isCoin ? '表／裏' : 'ダイス目', action: null, subActions: subActions });
    }

    actions.push(ContextMenuSeparator);

    actions.push((this.isDropShadow
      ? {
        name: '☑ 影の表示', action: () => {
          this.isDropShadow = false;
        }
      } : {
        name: '☐ 影の表示', action: () => {
          this.isDropShadow = true;
        }
      }));

    actions.push(ContextMenuSeparator);
    actions.push({ name: '詳細を表示', action: () => { this.showDetail(this.diceSymbol); } });
    if (this.diceSymbol.getUrls().length > 0) {
      actions.push({
        name: '参照URLを開く', action: null,
        subActions: this.diceSymbol.getUrls().map((urlElement) => {
          const url = urlElement.value.toString();
          return {
            name: urlElement.name ? urlElement.name : url,
            action: () => {
              if (StringUtil.sameOrigin(url)) {
                window.open(url.trim(), '_blank', 'noopener');
              } else {
                this.modalService.open(OpenUrlComponent, { url: url, title: this.diceSymbol.name, subTitle: urlElement.name });
              }
            },
            disabled: !StringUtil.validUrl(url),
            error: !StringUtil.validUrl(url) ? 'URLが不正です' : null,
            isOuterLink: StringUtil.validUrl(url) && !StringUtil.sameOrigin(url)
          };
        }),
      });
      actions.push(ContextMenuSeparator);
    }
    actions.push({
      name: 'コピーを作る', action: () => {
        let cloneObject = this.diceSymbol.clone();
        cloneObject.location.x += this.gridSize;
        cloneObject.location.y += this.gridSize;
        cloneObject.update();
        SoundEffect.play(PresetSound.dicePut);
      }
    });
    actions.push({
      name: '削除する', action: () => {
        this.diceSymbol.destroy();
        SoundEffect.play(PresetSound.sweep);
      }
    });
    this.contextMenuService.open(position, actions, this.name);
  }

  onMove() {
    SoundEffect.play(PresetSound.dicePick);
  }

  onMoved() {
    SoundEffect.play(PresetSound.dicePut);
  }

  diceRoll(): string {
    EventSystem.call('ROLL_DICE_SYNBOL', { identifier: this.diceSymbol.identifier });
    if (this.owner === '') {
      if (this.isCoin) {
        SoundEffect.play(PresetSound.coinToss);
      } else {
        SoundEffect.play(PresetSound.diceRoll1);
      }
    }
    let face = this.diceSymbol.diceRoll();
    if (this.owner === '') this.chatMessageService.sendOperationLog(`${this.diceSymbol.name} を${this.isCoin ? 'トスした' : '振った'} → ${face}`,"dice");
    else this.chatMessageService.sendOperationLog(`${this.diceSymbol.name} を${this.isCoin ? 'トスした' : '振った'}`,"dice");
    return face;
  }

  showDetail(gameObject: DiceSymbol) {
    EventSystem.trigger('SELECT_TABLETOP_OBJECT', { identifier: gameObject.identifier, className: gameObject.aliasName });
    let coordinate = this.pointerDeviceService.pointers[0];
    let title = 'ダイスシンボル設定';
    if (gameObject.name.length) title += ' - ' + gameObject.name;
    let option: PanelOption = { title: title, left: coordinate.x - 300, top: coordinate.y - 300, width: 600, height: 600 };
    let component = this.panelService.open<GameCharacterSheetComponent>(GameCharacterSheetComponent, option);
    component.tabletopObject = gameObject;
  }

  private startIconHiddenTimer() {
    clearTimeout(this.iconHiddenTimer);
    this.iconHiddenTimer = setTimeout(() => {
      this.iconHiddenTimer = null;
      this.changeDetector.markForCheck();
    }, 300);
    this.changeDetector.markForCheck();
  }

  private adjustMinBounds(value: number, min: number = 0): number {
    return value < min ? min : value;
  }
}
