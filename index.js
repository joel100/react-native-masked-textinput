'use strict';

import React from 'react';
import FloatLabelTextInput from 'react-native-floating-label-text-input';
import { TextInput, View, PropTypes } from 'react-native';

export default class MaskedTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.onChange = this.onChange.bind(this);
    this._isDigit = this._isDigit.bind(this);
    this._matchesMask = this._matchesMask.bind(this);
    this._isAlpha = this._isAlpha.bind(this);
    this._isStaticChar = this._isStaticChar.bind(this);
    this._getInputField = this._getInputField.bind(this);
  }

  static propTypes = {
      mask: React.PropTypes.string.isRequired
  };

  _isDigit(n) {
    // let re = /[0-9]/;
    // return re.test(n);
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

  _getInputField() {
    if (this.props.useFloatingLabel) {
      return ( <FloatLabelTextInput
                  ref={textInput => this.textInput = textInput}                  
                  onChangeTextValue={this.onChangeText}                  
                  onSelectionChanged={this.props.onSelectionChanged}                 
                  value={this.props.value}
                  placeholder={this.props.placeholder}
                  style={this.props.style}
                  onChange={this.onChange}
                  onEndEditing={this.props.onEndEditing}
                  onFocus={this.props.onFocus}
                  onSubmitEditing={this.props.onSubmitEditing}
                  placeholderTextColor={this.props.placeholderTextColor}
                  returnKeyType={this.props.returnKeyType}
                  autoCapitalize={this.props.autoCapitalize}/>);
    } else {
      return  (<TextInput 
                ref={textInput => this.textInput = textInput}
                onChangeText={this.onChangeText} 
                onSelectionChange={this.props.onSelectionChange} 
                value={this.props.value}
                placeholder={this.props.placeholder}
                style={this.props.style}
                onChange={this.onChange}
                onEndEditing={this.props.onEndEditing}
                onFocus={this.props.onFocus}
                onSubmitEditing={this.props.onSubmitEditing}
                placeholderTextColor={this.props.placeholderTextColor}
                returnKeyType={this.props.returnKeyType}
                autoCapitalize={this.props.autoCapitalize}></TextInput>);
    }
  }

  onChange(event) {
    let text = event.nativeEvent.text,
        current = text.length - 1;

    if (!this._matchesMask(text.charAt(current), this.props.mask.charAt(current))) {
      if (this._matchesMask(text.charAt(current), this.props.mask.charAt(current + 1))
       && this._isStaticChar(this.props.mask.charAt(current))) {
        text = [text.slice(0, current), this.props.mask.charAt(current), text.slice(current)].join('');
      } else if (text.length > 0) {  
        text = text.substr(0, current);    
      }
    }

    if (this.props.useFloatingLabel) {
      this.textInput.setText(text);
    } else {
      this.textInput.refs.input.setNativeProps(text);
    }    

    if (this.props.onChange) {
      event.nativeEvent.text = text;
      this.props.onChange(event);
    }

    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
  }

  render() {
    return (<View>
             {this._getInputField()}
          </View>);
  }
}