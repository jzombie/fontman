import React from 'react';
import Footer from '../Footer';
import style from './Preview.module.scss';
import axios from 'axios';
import CheckboxIcon from '../CheckboxIcon';
import DownloadIcon from '../DownloadIcon';
import UploadIcon from '../UploadIcon';

const previewStyleElement = document.createElement('style');
document.head.appendChild(previewStyleElement);

const Preview = (props) => {
  const { cssTemplateString, uuid, sizeIncrease, onClose } = props;

  previewStyleElement.innerHTML = cssTemplateString;

  return (
    <div className={style['preview']}>
      {
        cssColorCategories.map((category, categoryIdx) => {
          const { categoryName, colors } = category;

          return (
            <div
              className={style['colors-category']}
              key={categoryIdx}
            >
              <h1>{categoryName}</h1>
              {
                colors.map((color, cssColorIdx) => {
                  return (
                    <div
                      className={style['color-box']}
                      key={cssColorIdx}
                      title={color}
                    >
                      <div className={style['content-wrapper']}>
                        
                        <div className={style['icon-outer-wrapper']}>
                          <div className={style['icon-inner-wrapper']}>
                            <i key={cssColorIdx} style={{ color, fontSize: 48 }} className={`${uuid}-icon`} />
                          </div>
                        </div>
                      
                      </div>
                      
                      <div className={style['text-wrapper']}>
                        {color}
                      </div>
                    
                    </div>
                  );
                })
              }
            </div>
          )
        })
      }

      <Footer>
        <div>
          <div>
            Size { sizeIncrease < 0 ? 'Decrease' : 'Increase' } { Math.abs(sizeIncrease) } bytes
          </div>
          
          {
            sizeIncrease < 0 &&
            <div>
              <CheckboxIcon style={{color: 'LimeGreen', fontSize: '2.2rem'}} /> Resulting format is smaller than the original SVG! Nice!
            </div>
          }
        </div>

        <button onClick={ async (evt) => {
          try {
            // @see https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
            const resp = await axios({
              url: '/api/react-component-download-request',
              method: 'POST',
              data: {
                cssTemplateString,
                uuid
              },
              responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ReactComponent.zip');
            document.body.appendChild(link);
            link.click();

          } catch (exc) {
            throw exc;
          }
        }}>
          Download React Component <DownloadIcon />
        </button>
        |
        <button onClick={onClose}>Upload another Image <UploadIcon /></button>
      </Footer>

    </div>
  );
};

// @see https://www.quackit.com/css/css_color_codes.cfm
const cssColorCategories = [
  {
    categoryName: 'Reds',
    colors: [
      'IndianRed',
      'LightCoral',
      'Salmon',
      'DarkSalmon',
      'LightSalmon',
      'Crimson',
      'Red',
      'FireBrick',
      'DarkRed'
    ]
  },
  {
    categoryName: 'Pinks',
    colors: [
      'Pink',
      'LightPink',
      'HotPink',
      'DeepPink',
      'MediumVioletRed',
      'PaleVioletRed'
    ]
  },
  {
    categoryName: 'Oranges',
    colors: [
      'Coral',
      'Tomato',
      'OrangeRed',
      'DarkOrange',
      'Orange',
    ]
  },
  {
    categoryName: 'Yellows',
    colors: [
      'Gold',
      'Yellow',
      'LightYellow',
      'LemonChiffon	',
      'LightGoldenrodYellow',
      'PapayaWhip',
      'Moccasin',
      'PeachPuff',
      'PaleGoldenrod',
      'Khaki',
      'DarkKhaki'
    ]
  },
  {
    categoryName: 'Purples',
    colors: [
      'Lavender',
      'Thistle',
      'Plum',
      'Violet	',
      'Orchid',
      'Fuchsia',
      'Magenta',
      'MediumOrchid',
      'MediumPurple',
      'BlueViolet',
      'DarkViolet',
      'DarkOrchid',
      'DarkMagenta',
      'Purple',
      'RebeccaPurple',
      'Indigo',
      'MediumSlateBlue',
      'SlateBlue',
      'DarkSlateBlue'
    ]
  },
  {
    categoryName: 'Greens',
    colors: [
      'GreenYellow',
      'Chartreuse',
      'LawnGreen',
      'Lime',
      'LimeGreen',
      'PaleGreen',
      'LightGreen',
      'MediumSpringGreen',
      'SpringGreen',
      'MediumSeaGreen',
      'SeaGreen',
      'ForestGreen',
      'Green',
      'DarkGreen',
      'YellowGreen',
      'OliveDrab',
      'Olive',
      'DarkOliveGreen',
      'MediumAquamarine',
      'DarkSeaGreen',
      'LightSeaGreen',
      'DarkCyan',
      'Teal'
    ]
  },
  {
    categoryName: 'Blues / Cyans',
    colors: [
      'Aqua',
      'Cyan',
      'LightCyan',
      'PaleTurquoise',
      'Aquamarine',
      'Turquoise',
      'MediumTurquoise',
      'DarkTurquoise',
      'CadetBlue',
      'SteelBlue',
      'LightSteelBlue',
      'PowderBlue',
      'LightBlue',
      'SkyBlue',
      'LightSkyBlue',
      'DeepSkyBlue',
      'DodgerBlue',
      'CornflowerBlue',
      'RoyalBlue',
      'Blue',
      'MediumBlue',
      'DarkBlue',
      'Navy',
      'MidnightBlue'
    ]
  },
  {
    categoryName: 'Browns',
    colors: [
      'Cornsilk',
      'BlanchedAlmond',
      'Bisque',
      'NavajoWhite',
      'Wheat',
      'BurlyWood',
      'Tan',
      'RosyBrown',
      'SandyBrown',
      'Goldenrod',
      'DarkGoldenrod',
      'Peru',
      'Chocolate',
      'SaddleBrown',
      'Sienna',
      'Brown',
      'Maroon'
    ]
  },
  {
    categoryName: 'Whites',
    colors: [
      'White',
      'Snow',
      'Honeydew',
      'MintCream',
      'Azure',
      'AliceBlue',
      'GhostWhite',
      'WhiteSmoke',
      'Seashell',
      'Beige',
      'OldLace',
      'FloralWhite',
      'Ivory',
      'AntiqueWhite',
      'Linen',
      'LavenderBlush',
      'MistyRose'
    ]
  },
  {
    categoryName: 'Grays',
    colors: [
      'Gainsboro',
      'LightGray',
      'LightGrey',
      'Silver',
      'DarkGray',
      'DarkGrey',
      'Gray',
      'Grey',
      'DimGray',
      'DimGrey',
      'LightSlateGray',
      'LightSlateGrey',
      'SlateGray',
      'SlateGrey',
      'DarkSlateGray',
      'DarkSlateGrey',
      'Black'
    ]
  }
];


export default Preview;