type ConvertorProps = DisplayFlags & User & {
    currCountiesCodeMapDetail: CurrCountiesCodeMapDetail;
    sortedCurrsCodeList: string[];
    validCurFlagList: string[];
    isChartFeatureEnable: boolean;
}