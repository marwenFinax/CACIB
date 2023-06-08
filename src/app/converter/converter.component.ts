import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { Conversion } from '../models/Conversion';
import { ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';






@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent {
  montantEUR = 0;
  montantUSD = 0;
  tauxSaisi = 1.1;
  tauxReel=1.1
  switchChecked = false;
  tauxFixe = false;
  historique: Conversion[] = [];
  dataSource: MatTableDataSource<Conversion>;
  repectVariation:boolean=true;
  



  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<Conversion>(this.historique);
    interval(3000).subscribe(() => {
      const variation = Math.random() * 0.1 - 0.05;
      this.tauxReel += variation;
      this.tauxSaisi= this.tauxFixe?this.tauxSaisi:this.tauxReel;
      this.changeDetectorRef.detectChanges();
      this.convert();

    });
  }
  //Une fois l'utilisateur termine la saisie on va verifier s'il a respecter la règle de variation du taux
  public checkValidation(){
    this.repectVariation=(Math.abs(this.tauxSaisi-this.tauxReel)< this.tauxReel * 0.02  );
    this.tauxFixe=this.repectVariation ?this.tauxFixe:false;
  }

  //Convertir une valeur  dollard/euro

  public convert(): Conversion {  
    const tauxDechange=this.repectVariation && !this.tauxFixe?this.tauxReel:this.tauxSaisi ;
    const valeurInitiale = this.switchChecked ? this.montantUSD : this.montantEUR;
    const valeurCalculee = this.switchChecked ? this.montantUSD * tauxDechange : this.montantEUR / tauxDechange;
    this.montantEUR=this.switchChecked? valeurCalculee:this.montantEUR;
    this.montantUSD=!this.switchChecked?valeurCalculee:this.montantUSD
    return  new Conversion(this.tauxReel,this.tauxSaisi,valeurInitiale,valeurCalculee);
  }
  
  //On ajoute les dernieres conversion demandé par l'utilsateur
  public updateTable(){
    this.historique.push(this.convert());
    this.dataSource.data = this.historique.slice();
    if (this.historique.length > 5) {
      this.historique.shift();
      this.dataSource.data = this.historique.slice();
    }
  }
 

}
