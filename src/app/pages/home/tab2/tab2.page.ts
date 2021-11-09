/* eslint-disable max-len */
import { Component, Input, OnInit } from '@angular/core';
import { FAQs } from 'src/app/interfaces/FAQs';
import { GenericService } from 'src/app/services/generic.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { idEmpresa } from '../../../environments/environment.prod';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @Input() data: any;
  faqs: FAQs;
  viewFAQs = false;
  title: string;
  listMaterias: Array<string> = ['Matematicas', 'Español', 'Ciencias', 'Ingles', 'Biologia','Matematicas', 'Español', 'Ciencias', 'Ingles', 'Biologia', ];
  constructor(
    private sqlGenericService: SqlGenericService,
    private loadingService: LoadingService,
    private genericService: GenericService
  ) { }

  ngOnInit() {
    //this.getFAQ();
  }
  /**
   * function to obtain the questions depending on the selected subject
   *
   * @param item momentary variable to obtain the selected matter.
   */
  getFAQ(item) {
    this.title = item;
    const sql = `SELECT * FROM preguntas_frecuentes WHERE id_empresa = ${idEmpresa}`;
   this.loadingService.show('Espere...');
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      this.faqs = response.parameters;
      this.viewFAQs = true;
      this.loadingService.hide();
      console.log(this.faqs);
    });
  }
  /**
   * function to expand and collapse the panel
   *
   * @param evt Variable that is equivalent to the selected item
   */
  accordion(evt): void {
      const panel = evt.srcElement.parentNode.nextSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        evt.target.name = 'add';
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        evt.target.name = 'close';
      };
  }
  /**
   * function to return to the subject list.
   */
  return(){
    this.viewFAQs = false;
  }
};
