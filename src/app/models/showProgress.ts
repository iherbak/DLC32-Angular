export class ShowProgress {
    public SpinnerMode: 'determinate' | 'indeterminate' = 'indeterminate';
    public Show: boolean = true;
    public DeterminatePercentage: number = 0;

    constructor(show: boolean = true, indeterminate: boolean = true, percentage: number = 0) {
        this.SpinnerMode = indeterminate ? 'indeterminate' : 'determinate';
        this.Show = show;
        this.DeterminatePercentage = percentage;
    }
}