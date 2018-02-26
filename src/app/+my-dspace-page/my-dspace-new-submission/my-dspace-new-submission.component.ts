import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { UploadFilesComponentOptions } from '../../shared/upload-files/upload-files-component-options.model';
import { Workspaceitem } from '../../core/submission/models/workspaceitem.model';
import { SubmissionState } from '../../submission/submission.reducers';
import { Store } from '@ngrx/store';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';

@Component({
  selector: 'ds-my-dspace-new-submission',
  styleUrls: ['./my-dspace-new-submission.component.scss'],
  templateUrl: './my-dspace-new-submission.component.html'
})

export class MyDSpaceNewSubmissionComponent implements OnInit {
  @Output()
  wsiUploaded = new EventEmitter<Workspaceitem[]>();

  public uploadFilesOptions: UploadFilesComponentOptions = {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  };

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private store: Store<SubmissionState>,
              private wsiDataService: WorkspaceitemDataService) {
  }

  ngOnInit() {
    this.wsiDataService.getEndpoint('workspace').subscribe( (url) => {
        this.uploadFilesOptions.url = url;
        console.log('Url is ', url);
      }
    );
  }

  onBeforeUpload = () => {
    // Nothing
  };

  public onCompleteItem(workspaceitems: Workspaceitem[]) {
    this.wsiUploaded.emit(workspaceitems);
  }

}