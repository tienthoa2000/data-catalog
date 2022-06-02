import colors from 'vuetify/es5/util/colors'

export default {
  customVariables: ['~style/variables.scss'],
  treeShake: true,
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#43a5c4',
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3,
        searchbg: '#DFECF0',
        chipbg: '#62BB46',
        // XD指定
        rectline: '#CBCBCB',  // --枠線: #CBCBCB;
        color1: '#23F7DF', // --unnamed-color-23f7df45: #23F7DF;
        color2: '#DFEDF2',// --unnamed-color-dfedf2: #DFEDF2;
        color3: '#77A1AF',// --unnamed-color-77a1af: #77A1AF;
        color4: '#343A3E',// --unnamed-color-343a3e: #343A3E;
        color5: '#F2F2F2',// --unnamed-color-f2f2f2: #F2F2F2;
        color6: '#42484D',// --unnamed-color-42484d: #42484D;
        color7: '#D9D9D9',// --unnamed-color-d9d9d9: #D9D9D9;
        color8: '#2AB5E2',// --unnamed-color-2ab5e2: #2AB5E2;
        color9: '#2A3236',// --unnamed-color-2a3236: #2A3236;
        icon1: '#D0C800',// --アイコンカラー１: #D0C800;
        icon2: '#CB9C00',// --アイコンカラー２: #CB9C00;
        icon3: '#62BB46',// --アイコンカラー３: #62BB46;
        color10: '#62BB46',// --unnamed-color-62bb464d: #62BB46;
        textbox: '#EDEDFA',// --テキストボックス: #EDEDFA;
        lineageline: '#57B1FF',// --リネージ線: #57B1FF;
        tabbg: '#F4F4F4',// --背景（オーバーレイタブ内）: #F4F4F4;
        oevrlaybg: '#FCFCFC',// --背景（オーバーレイ）: #FCFCFC;
        darkbg: '#E2E6F4',// --背景（濃）: #E2E6F4;
        linebg: '#EEF2F9',// --背景（淡）: #EEF2F9;
        textmain: '#41434E',// --メインテキスト: #41434E;
        textsub: '#777777',// --サブテキスト: #777777;
        textheader: '#909090',// --見出しテキスト: #909090;
        textdiabled: '#D5D5D5',// --非活性テキスト: #D5D5D5;
        pathline: '#EAEAEA',// --線: #EAEAEA;
        // --透明: #FFFFFF;
        iconside: '#F5F5F5',// --サイドバーアイコン: #F5F5F5;
        // --メインカラー: #43A5C4;
        color11: '#EB005A'// --unnamed-color-eb005a9d: #EB005A;
      },
    },
  },
}
