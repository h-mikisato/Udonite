import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BadgeComponent } from 'component/badge/badge.component';
import { CardStackListComponent } from 'component/card-stack-list/card-stack-list.component';
import { CardStackComponent } from 'component/card-stack/card-stack.component';
import { CardComponent } from 'component/card/card.component';
import { ChatInputComponent } from 'component/chat-input/chat-input.component';
import { ChatMessageComponent } from 'component/chat-message/chat-message.component';
import { ChatMessageEaseComponent } from 'component/chat-message-ease/chat-message-ease.component';
import { ChatTabSettingComponent } from 'component/chat-tab-setting/chat-tab-setting.component';
import { ChatTabComponent } from 'component/chat-tab/chat-tab.component';
import { ChatWindowComponent } from 'component/chat-window/chat-window.component';
import { ContextMenuComponent } from 'component/context-menu/context-menu.component';
import { DiceSymbolComponent } from 'component/dice-symbol/dice-symbol.component';
import { FileSelecterComponent } from 'component/file-selecter/file-selecter.component';
import { FileStorageComponent } from 'component/file-storage/file-storage.component';
import { GameCharacterSheetComponent } from 'component/game-character-sheet/game-character-sheet.component';
import { GameCharacterComponent } from 'component/game-character/game-character.component';
import { GameDataElementComponent } from 'component/game-data-element/game-data-element.component';
import { GameObjectInventoryComponent } from 'component/game-object-inventory/game-object-inventory.component';
import { GameTableMaskComponent } from 'component/game-table-mask/game-table-mask.component';
import { GameTableSettingComponent } from 'component/game-table-setting/game-table-setting.component';
import { GameTableComponent } from 'component/game-table/game-table.component';
import { JukeboxComponent } from 'component/jukebox/jukebox.component';
import { LobbyComponent } from 'component/lobby/lobby.component';
import { ModalComponent } from 'component/modal/modal.component';
import { OverviewPanelComponent } from 'component/overview-panel/overview-panel.component';
import { PasswordCheckComponent } from 'component/password-check/password-check.component';
import { PeerCursorComponent } from 'component/peer-cursor/peer-cursor.component';
import { PeerMenuComponent } from 'component/peer-menu/peer-menu.component';
import { RoomSettingComponent } from 'component/room-setting/room-setting.component';
import { TerrainComponent } from 'component/terrain/terrain.component';
import { TextNoteComponent } from 'component/text-note/text-note.component';
import { TextViewComponent } from 'component/text-view/text-view.component';
import { UIPanelComponent } from 'component/ui-panel/ui-panel.component';
import { DraggableDirective } from 'directive/draggable.directive';
import { MovableDirective } from 'directive/movable.directive';
import { ResizableDirective } from 'directive/resizable.directive';
import { RotableDirective } from 'directive/rotable.directive';
import { TooltipDirective } from 'directive/tooltip.directive';
import { SafePipe } from 'pipe/safe.pipe';

import { AppConfigService } from 'service/app-config.service';
import { ChatMessageService } from 'service/chat-message.service';
import { ContextMenuService } from 'service/context-menu.service';
import { GameObjectInventoryService } from 'service/game-object-inventory.service';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { TabletopService } from 'service/tabletop.service';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { OpenUrlComponent } from 'component/open-url/open-url.component';
import { StandSettingComponent } from './component/stand-setting/stand-setting.component';
import { StandElementComponent } from './component/stand-element/stand-element.component';
import { StandImageComponent } from './component/stand-image/stand-image.component';

import { StandImageService } from 'service/stand-image.service';
import { CounterService } from 'service/counter.service';
import { DiceRollTableSettingComponent } from './component/dice-roll-table-setting/dice-roll-table-setting.component';
import { PlayerPaletteComponent } from './component/player-palette/player-palette.component';
import { PlayerPaletteControlComponent } from './component/player-palette-control/player-palette-control.component';
import { NetworkStatusComponent } from './component/network-status/network-status.component';
import { CutInComponent } from './component/cut-in/cut-in.component';
import { CutInSettingComponent } from './component/cut-in-setting/cut-in-setting.component';
import { YouTubePlayerModule } from "@angular/youtube-player";
import { CardListImageComponent } from './component/card-list-image/card-list-image.component';
import { RoundComponent } from './component/round/round.component';
import { CounterListComponent } from './component/counter-list/counter-list.component';
import { CounterInventoryComponent } from './component/counter-inventory/counter-inventory.component';
import { EffectViewComponent } from './component/effect-view/effect-view.component';
import { SubMenuComponent } from './component/sub-menu/sub-menu.component';
import { ChatInputSendfromComponent } from './component/chat-input-sendfrom/chat-input-sendfrom.component';
import { ChatInputSettingComponent } from './component/chat-input-setting/chat-input-setting.component';
import { ChatTabEaseComponent } from './component/chat-tab-ease/chat-tab-ease.component';
import { BillBoardComponent } from './component/bill-board/bill-board.component';
import { BillBoardCardComponent } from './component/bill-board-card/bill-board-card.component';
import { StandViewSettingComponent } from './component/stand-view-setting/stand-view-setting.component';
import { RoomControlComponent } from './component/room-control/room-control.component';
import { SimpleCreateComponent } from './component/simple-create/simple-create.component';
import { GameRoomComponent } from './component/game-room/game-room.component';
import { InnerNoteComponent } from './component/inner-note/inner-note.component';
import { PopupEditComponent } from './component/popup-edit/popup-edit.component';
import { PopupComponent } from './component/popup/popup.component';
import { ChatEditComponent } from './component/chat-edit/chat-edit.component';
import { PlayerSelectComponent } from './component/player-select/player-select.component';
import { ImageViewComponent } from './component/image-view/image-view.component';
import { DataElementComponent } from './component/data-element/data-element.component';
import { SyncWaitComponent } from './component/sync-wait/sync-wait.component';
import { DataLoadComponent } from './component/data-load/data-load.component';
import { GameTableFlatComponent } from './component/game-table-flat/game-table-flat.component';
import { GameCharacterFlatComponent } from './component/game-character-flat/game-character-flat.component';
import { TerrainFlatComponent } from './component/terrain-flat/terrain-flat.component';
import { PlayerControlComponent } from './component/player-control/player-control.component';
import { AlarmComponent } from './component/alarm/alarm.component';
import { HelpComponent } from './component/help/help.component';
import { HelpMainComponent } from './component/help/help-main/help-main.component';
import { HelpRoomComponent } from './component/help/help-room/help-room.component';
import { HelpChatComponent } from './component/help/help-chat/help-chat.component';
import { HelpCharacterComponent } from './component/help/help-character/help-character.component';
import { HelpMenuComponent } from './component/help/help-menu/help-menu.component';
import { HelpObjectComponent } from './component/help/help-object/help-object.component';
import { HelpStandComponent } from './component/help/help-stand/help-stand.component';
import { HelpCounterComponent } from './component/help/help-counter/help-counter.component';
import { HelpBoardComponent } from './component/help/help-board/help-board.component';
import { HelpPopupComponent } from './component/help/help-popup/help-popup.component';
import { HelpCutinComponent } from './component/help/help-cutin/help-cutin.component';
import { HelpDicerollComponent } from './component/help/help-diceroll/help-diceroll.component';
import { HelpImageComponent } from './component/help/help-image/help-image.component';
import { DiceSymbolFlatComponent } from './component/dice-symbol-flat/dice-symbol-flat.component';
import { LogSaveComponent } from './component/log-save/log-save.component';
import { SimpleInventoryComponent } from './component/simple-inventory/simple-inventory.component';
import { UiTrayComponent } from './component/ui-tray/ui-tray.component';
import { ViewSettingComponent } from './component/view-setting/view-setting.component';

@NgModule({
  declarations: [
    AppComponent,
    BadgeComponent,
    CardComponent,
    CardStackComponent,
    CardStackListComponent,
    ChatMessageComponent,
    ChatMessageEaseComponent,
    ChatTabComponent,
    ChatTabSettingComponent,
    ChatWindowComponent,
    ContextMenuComponent,
    CounterListComponent,
    FileSelecterComponent,
    FileStorageComponent,
    GameCharacterSheetComponent,
    GameCharacterComponent,
    GameDataElementComponent,
    GameObjectInventoryComponent,
    GameTableMaskComponent,
    GameTableSettingComponent,
    GameTableComponent,
    JukeboxComponent,
    LobbyComponent,
    ModalComponent,
    OverviewPanelComponent,
    PasswordCheckComponent,
    PeerMenuComponent,
    RoomSettingComponent,
    UIPanelComponent,
    SafePipe,
    TextViewComponent,
    TerrainComponent,
    PeerCursorComponent,
    TextNoteComponent,
    MovableDirective,
    RotableDirective,
    DiceSymbolComponent,
    TooltipDirective,
    DraggableDirective,
    ResizableDirective,
    ChatInputComponent,
    OpenUrlComponent,
    StandSettingComponent,
    StandElementComponent,
    StandImageComponent,
    DiceRollTableSettingComponent,
    PlayerPaletteComponent,
    PlayerPaletteControlComponent,
    NetworkStatusComponent,
    CutInComponent,
    CutInSettingComponent,
    CardListImageComponent,
    RoundComponent,
    CounterInventoryComponent,
    EffectViewComponent,
    SubMenuComponent,
    ChatInputSendfromComponent,
    ChatInputSettingComponent,
    ChatTabEaseComponent,
    BillBoardComponent,
    BillBoardCardComponent,
    StandViewSettingComponent,
    RoomControlComponent,
    SimpleCreateComponent,
    GameRoomComponent,
    InnerNoteComponent,
    PopupEditComponent,
    PopupComponent,
    ChatEditComponent,
    PlayerSelectComponent,
    ImageViewComponent,
    DataElementComponent,
    SyncWaitComponent,
    DataLoadComponent,
    GameTableFlatComponent,
    GameCharacterFlatComponent,
    TerrainFlatComponent,
    PlayerControlComponent,
    AlarmComponent,
    HelpComponent,
    HelpMainComponent,
    HelpRoomComponent,
    HelpChatComponent,
    HelpCharacterComponent,
    HelpMenuComponent,
    HelpObjectComponent,
    HelpStandComponent,
    HelpCounterComponent,
    HelpBoardComponent,
    HelpPopupComponent,
    HelpCutinComponent,
    HelpDicerollComponent,
    HelpImageComponent,
    DiceSymbolFlatComponent,
    LogSaveComponent,
    SimpleInventoryComponent,
    UiTrayComponent,
    ViewSettingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    YouTubePlayerModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AppConfigService,
    ChatMessageService,
    ContextMenuService,
    ModalService,
    GameObjectInventoryService,
    PanelService,
    PointerDeviceService,
    TabletopService,
    StandImageService,
    CounterService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
