import { Injectable } from '@angular/core';
import {Contacto } from './contacto';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  private baseURI: string = 'http://localhost:8080/api/agenda/contactos';
  private wsURI: string = 'ws://localhost:8081/ws';
  private webSocket!: WebSocket;
  private listeners: (() => void) [] = [];

  constructor(private http: HttpClient) {
    this.inicializarWebSocket();
  }

  private inicializarWebSocket() {
    this.webSocket = new WebSocket(this.wsURI);
    this.webSocket.onmessage = (event) => {
      console.log(event.data);
      this.listeners.forEach(l => l());
    };
    this.webSocket.onopen = (event) => {
      console.log("Conectado");
    };
    this.webSocket.onclose = (event) => {
      console.log("Desconectado");
    };
    this.webSocket.onerror = (event) => {
      console.log("Error");
    };
  }

  private enviarMensaje(mensaje: string) {
    this.webSocket.send(mensaje);
  }

  registraOnChangeListener(listener: () => void) {
    this.listeners.push(listener);
  }

  eliminarOnChangeListener(listener: () => void) {
    this.listeners = this.listeners.filter(l => l != listener);
  }

  getContactos(): Observable<Contacto []> {
    return this.http.get<Contacto []>(this.baseURI);
  }

  addContacto(contacto: Contacto): Observable<Contacto> {
    this.enviarMensaje("Nuevo contacto");
    return this.http.post<Contacto>(this.baseURI, contacto);
  }

  editarContacto(contacto: Contacto): Observable<Contacto> {
    return this.http.put<Contacto>(this.baseURI + '/' + contacto.id, contacto);
  }

  eliminarcContacto(id: number): Observable<HttpResponse<string>> {
    return this.http.delete(this.baseURI + '/' + id, {observe: "response", responseType: 'text'});
  }
}
