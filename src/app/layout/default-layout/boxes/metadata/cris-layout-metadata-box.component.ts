import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CrisLayoutBox as CrisLayoutBoxObj } from 'src/app/layout/models/cris-layout-box.model';
import { CrisLayoutBox } from 'src/app/layout/decorators/cris-layout-box.decorator';
import { LayoutTab } from 'src/app/layout/enums/layout-tab.enum';
import { LayoutBox } from 'src/app/layout/enums/layout-box.enum';
import { LayoutPage } from 'src/app/layout/enums/layout-page.enum';
import { MetadataComponent } from 'src/app/core/layout/models/metadata-component.model';
import { MetadataComponentsDataService } from 'src/app/core/data/metadata-components-data.service';
import { getAllSucceededRemoteDataPayload, getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';
import { Observable } from 'rxjs';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { hasValue } from 'src/app/shared/empty.util';

@Component({
  selector: 'ds-cris-layout-metadata-box',
  templateUrl: './cris-layout-metadata-box.component.html',
  styleUrls: ['./cris-layout-metadata-box.component.scss']
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.DEFAULT, LayoutBox.METADATA)
export class CrisLayoutMetadataBoxComponent extends CrisLayoutBoxObj implements OnInit {

  metadatacomponents: MetadataComponent;

  bitstream = [];
  metadata: [];

  constructor(
    public cd: ChangeDetectorRef,
    private metadatacomponentsService: MetadataComponentsDataService,
    private bitstreamDataService: BitstreamDataService
  ) {
    super();
  }

  ngOnInit() {
    this.metadatacomponentsService.findById(this.box.shortname)
      .pipe(getAllSucceededRemoteDataPayload())
      .subscribe(
        (next) => {
          this.metadatacomponents = next;
          this.retrieveBitstream(this.metadatacomponents);
          this.cd.markForCheck();
        }
      );
  }

  retrieveBitstream(metadatacomponents: MetadataComponent) {
    metadatacomponents.rows.forEach((row) => {
      row.fields.forEach((field) => {
        if (field.fieldType === 'bitstream') {
          this.bitstream.push(field);
          return;
        }
      });
    });
  }

  hasBitstream() {
    return hasValue(this.bitstream) && this.bitstream.length > 0;
  }

  getThumbnail(): Observable<Bitstream> {
    return this.bitstreamDataService.getThumbnailFor(this.item).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }
}