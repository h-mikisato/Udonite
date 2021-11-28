import { Injectable } from '@angular/core';
import { EventSystem } from '@udonarium/core/system';
import { GameCharacter } from '@udonarium/game-character';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { DataElement } from '@udonarium/data-element';
import { PanelOption, PanelService } from 'service/panel.service';
import { PlayerService } from 'service/player.service';

@Injectable({
  providedIn: 'root'
})
export class GameCharacterService {

  gameType:string = "";

  //基本
  get(identifier: string) :GameCharacter {
    let object = ObjectStore.instance.get(identifier);
    if (object instanceof GameCharacter) {
      return object;
    }
    return null;
  }

  color(identifier: string) :string {
    let gameCharacter = this.get(identifier);
    if(gameCharacter) {
      if(gameCharacter.chatPalette && gameCharacter.chatPalette.color && gameCharacter.chatPalette.color != '#ffffff')
        return gameCharacter.chatPalette.color;
      return '#444';
    }
    return null
  }

  location(identifier: string,onlyTable :boolean) :boolean {
    return this.locationCheck(this.get(identifier) ,onlyTable)
  }

  dataElements(identifier :string) :DataElement[] {
    return this.get(identifier).detailDataElement.children as DataElement[];
  }

  //チャット用
  chatId :string;
  chatCharacter:GameCharacter;
  chatSet(sendFrom :string ,isUseFaceIcon: boolean, text:string, standName:string){
    let standIdentifier:string = "";
    let standInfo = null;
    if (sendFrom != this.chatId) {
      this.chatId = sendFrom;
      this.chatCharacter = this.get(this.chatId);
    }
    (isUseFaceIcon && this.chatCharacter.faceIcon) ? isUseFaceIcon = true : isUseFaceIcon = false;
    let imageIdentifier = isUseFaceIcon ?
        this.chatCharacter.faceIcon?.identifier : this.chatCharacter.imageFile?.identifier;
    if (this.chatCharacter.imageFile && this.chatCharacter.standList) {
      standInfo = this.chatCharacter.standList.matchStandInfo(text,this.chatCharacter.imageFile.identifier , standName);
      standIdentifier =  standInfo.standElementIdentifier;
    }
    return {
      name: this.chatCharacter.name ,
      imageIdentifier: imageIdentifier ? imageIdentifier : '',
      color: this.chatCharacter.chatPalette?.paletteColor ? 
       this.chatCharacter.chatPalette.paletteColor : "",
      isInverse: !isUseFaceIcon ? Number(this.chatCharacter.isInverse) : 0,
      isHollow: !isUseFaceIcon ? Number(this.chatCharacter.isHollow) : 0,
      isBlackPaint: !isUseFaceIcon ? Number(this.chatCharacter.isBlackPaint) : 0,
      aura: !isUseFaceIcon ? Number(this.chatCharacter.aura) : -1,
      standInfo: standInfo,
      standIdentifier: standIdentifier,
      isUseFaceIcon: isUseFaceIcon
    };
  }

  //リスト系
  locationCheck(gameCharacter: GameCharacter,onlyTable :boolean): boolean {
    if (!gameCharacter) return false;
    switch (gameCharacter.location.name) {
      case 'table':
        return true;
      case 'graveyard':
        return false;
      default :
        return !onlyTable;
    }
  }
  private shouldUpdateCharacterList: boolean = true;
  private _gameCharacters: GameCharacter[] = [];
  private _gameCharacters_onlyTable: GameCharacter[] = [];
  list(onlyTable: boolean) : GameCharacter[] {
    if (this.shouldUpdateCharacterList) {
      this.shouldUpdateCharacterList = false;
      let tempCharacters = ObjectStore.instance
        .getObjects<GameCharacter>(GameCharacter);

      this._gameCharacters = tempCharacters
        .filter(character => this.locationCheck(character, false));
      this._gameCharacters_onlyTable = tempCharacters
        .filter(character => this.locationCheck(character, true));
    }
    if (onlyTable) return this._gameCharacters_onlyTable;
    return this._gameCharacters;
  }

  //イメージ
  aura :string[] = ["black", "blue", "green", "cyan", "red", "magenta", "yellow", "white" ]
  effectClass(identifier: string) :string[] {
    let myClass :string[] = ["aura"];
    let character = this.get(identifier);
    if(character.isInverse) myClass.push("inverse");
    if(character.isHollow) myClass.push("hollow");
    if(character.aura != -1) myClass.push(this.aura[Number(character.aura)]);
    return myClass;
  }
  
  imageUrl(identifier: string ,isUseFaceIcon :boolean): string {
    let character = this.get(identifier);
    if (isUseFaceIcon && character.faceIcon != null && 0 < character.faceIcon?.url?.length)
      return character.faceIcon?.url;
    if (character.imageFile != null && 0 < character.imageFile.url.length)
      return character.imageFile.url;
    return "";
  }

  constructor(
    private panelService: PanelService,
    private playerService: PlayerService
  ) { 
    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        if (event.data.aliasName !== GameCharacter.aliasName) return;
        if (!this.locationCheck(this.get(event.data.identifier),false)) {
          this.playerService.removeList(event.data.identifier); 
        }
        this.shouldUpdateCharacterList = true;
      })
      .on('DELETE_GAME_OBJECT', -1000, event => {
        if (this.playerService.checkList(event.data.identifier)) {
          this.playerService.removeList(event.data.identifier);
        }
      });
  }
}
