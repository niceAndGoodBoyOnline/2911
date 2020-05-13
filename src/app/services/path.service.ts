import { Injectable } from '@angular/core';

@Injectable() 
export class pathService {
  path: string = "http://localhost:3000/";
  //path: string = "/";

  constructor() { }
}
