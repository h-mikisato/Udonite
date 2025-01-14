import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FileArchiver } from '@udonarium/core/file-storage/file-archiver';
import { RoomService,RoomState } from 'service/room.service';
import * as JSZip from 'jszip/dist/jszip.min.js';
import { MimeType } from '@udonarium/core/file-storage/mime-type';

@Component({
  selector: 'data-load',
  templateUrl: './data-load.component.html',
  styleUrls: ['./data-load.component.css']
})
export class DataLoadComponent implements OnInit, AfterViewInit {
  message:string = "ルームデータを開いています";
  roomFile:File;
  xmlFile:File[] = [];
  imageFile:File[] = [];

  constructor(
    private roomService: RoomService
  ) { }

  async loading() {
    if (!(0 <= this.roomFile.type.indexOf('application/') || this.roomFile.type.length < 1)) {
      this.roomFile = null;
      this.roomService.roomFile = null;
      this.roomService.roomState = RoomState.PLAY;
      return;
    }
    await this.fileChecker();
    this.message = 'ルームデータを同期しています ' + this.xmlFile.length + '個';
    await this.xmlLoad();
    this.message = '画像データを同期しています ' + this.imageFile.length + '個';
    await this.imageLoad();
    this.xmlFile = [];
    this.imageFile = [];
    this.roomService.roomFile = null;
    this.roomService.roomAdmin.disableRoomLoad = true;
    this.roomService.roomState = RoomState.PLAY;
  }

  async fileChecker() {
    let file = this.roomFile;
    this.roomFile = null;
    let zip = new JSZip();
    try {
      zip = await zip.loadAsync(file);
    } catch (reason) {
      console.warn(reason);
      return;
    }
    let zipEntries = [];
    zip.forEach((relativePath, zipEntry) => zipEntries.push(zipEntry));
    for (let zipEntry of zipEntries) {
      try {
        let arraybuffer = await zipEntry.async('arraybuffer');
        let newfile = new File([arraybuffer], zipEntry.name, { type: MimeType.type(zipEntry.name) });
        if (newfile.type.indexOf('text/') != -1) this.xmlFile.push(newfile);
        if (newfile.type.indexOf('image/') != -1) this.imageFile.push(newfile); 
      } catch (reason) {
        console.warn(reason);
      }
    }
  }

  async xmlLoad() {
    if (this.xmlFile.length < 1) return;
    await  FileArchiver.instance.load(this.xmlFile);
  }

  async imageLoad() {
    if (this.imageFile.length < 1) return;
    await  FileArchiver.instance.load(this.imageFile);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (!this.roomService.roomFile) this.roomService.roomState = RoomState.PLAY;
    this.roomFile = this.roomService.roomFile.item(0);
    this.loading();
  }

}
