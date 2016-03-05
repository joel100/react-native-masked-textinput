'use strict';

var React = require('react-native');
var DocumentSelectionState = require('../react-native/Libraries/vendor/document/selection/DocumentSelectionState');

var { 
  TextInput, 
  View,
  PropTypes
} = React;

class MaskedText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: { start: 0, end: 0 }
    };

    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.select = this.select.bind(this);
    this.render = this.render.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.onChangeText = this.onChangeText.bind(this);
    this._isDigit = this._isDigit.bind(this);
    this._matchesMask = this._matchesMask.bind(this);
    this._isAlpha = this._isAlpha.bind(this);
    this._isStaticChar = this._isStaticChar.bind(this);
  }

  static propTypes = {
      mask: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired
  };

  _isDigit(n) {
    return Boolean([true, true, true, true, true, true, true, true, true, true][n]);
  }

  _isAlpha(n) {
    let re = /[a-z]/i;
    return re.test(n);
  }

  _matchesMask(n, maskChar) {
    if (maskChar === 'n' || this._isDigit(maskChar)) {
      return this._isDigit(n);
    } else if (maskChar === 'a') {
      return this._isAlpha(n);
    } else {
      return n === maskChar;
    }
  }

  _isStaticChar(n) {
    let staticChars = [' ', '(', ')', '-', ',']; //add more here
    return staticChars.indexOf(n) >= 0;
  }

  onSelectionChange({nativeEvent: {selection}}) {
    this.setState({selection});
  }

  onChange(event) {
    let text = event.nativeEvent.text,
        current = text.length - 1;

    console.log(text);

    if (!this._matchesMask(text.charAt(current), this.props.mask.charAt(current))) {
      console.log('doesn\'t match mask');
      if (this._matchesMask(text.charAt(current), this.props.mask.charAt(current + 1))
       && this._isStaticChar(this.props.mask.charAt(current))) {
        console.log('adding static mask');
        text = [text.slice(0, current), this.props.mask.charAt(current), text.slice(current)].join('');
      } else if (text.length > 0) {  
        console.log('removing char')
        text = text.substr(0, current);    
        console.log(text);
      }
    }

    this.textInput.refs.input.setNativeProps(text);

    if (this.props.onChange) {
      console.log(text);
      event.nativeEvent.text = text;
      this.props.onChange(event);
    }
  }

  select(start, end) {
    this.textInput.focus();
    this.setState({selection: {start, end}});
  }

  render() {
    return (<View>
              <TextInput 
                ref={textInput => this.textInput = textInput}
                onChangeText={this.onChangeText} 
                onSelectionChange={this.onSelectionChange} 
                value={this.props.value}
                placeholder={this.props.placeholder}
                style={this.props.style}
                onChange={this.onChange}
                onEndEditing={this.props.onEndEditing}
                selection={this.state.selection}
                autoFocus></TextInput>
          </View>);
  }
}

module.exports = MaskedText;