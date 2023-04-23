import { Component, OnInit } from '@angular/core';
import {Contacto } from './contacto';
import {ContactosService } from './contactos.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormularioContactoComponent} from './formulario-contacto/formulario-contacto.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  contactos: Contacto [] = [];
  contactoElegido?: Contacto;

  constructor(private contactosService: ContactosService, private modalService: NgbModal) {
    contactosService.registraOnChangeListener(() =>
      this.actualizaContactos(this.contactoElegido?.id));
  }

  ngOnInit(): void {
    this.actualizaContactos();
  }

  private actualizaContactos(id?: number): void {
    this.contactosService.getContactos()
      .subscribe(contactos => {
        this.contactos = contactos;
        if (id) {
          this.contactoElegido = this.contactos.find(c => c.id == id);
        }
      });
  }

  elegirContacto(contacto: Contacto): void {
    this.contactoElegido = contacto;
  }

  aniadirContacto(): void {
    let ref = this.modalService.open(FormularioContactoComponent);
    ref.componentInstance.accion = "Añadir";
    ref.componentInstance.contacto = {id: 0, nombre: '', apellidos: '', email: '', telefono: ''};
    ref.result.then((contacto: Contacto) => {
      this.contactosService.addContacto(contacto).subscribe(c => {});
    }, (reason) => {
      console.log(reason);
    });

  }
  contactoEditado(contacto: Contacto): void {
    this.contactosService.editarContacto(contacto).subscribe(c => {});
  }

  eliminarContacto(id: number): void {
    this.contactosService.eliminarcContacto(id).subscribe(c => {});
    this.contactoElegido = undefined;
  }
}
