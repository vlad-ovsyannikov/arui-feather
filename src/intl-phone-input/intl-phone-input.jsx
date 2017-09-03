/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { autobind } from 'core-decorators';
import React from 'react';
import Type from 'prop-types';

import { parse, format, asYouType } from 'libphonenumber-js';

import FlagIcon from '../flag-icon/flag-icon';
import Input from '../input/input';
import Select from '../select/select';

import cn from '../cn';
import performance from '../performance';

import countries from './countries';

const MAX_DIAL_CODE_LENGTH = 4;

/**
 * Компонент ввода международного телефона по маске.
 */
@cn('intl-phone-input', Input, Select)
@performance()
class IntlPhoneInput extends React.Component {
    static propTypes = {
        ...Input.propTypes,
        /** Подсказка в текстовом поле */
        inputPlaceholder: Type.string
    };

    static defaultProps = {
        inputPlaceholder: '+7 000 000 00 00'
    };

    state = {
        countryIso2: 'ru',
        inputFocused: false,
        inputMask: '+1 111 111 11 11',
        inputValue: ''
    }

    countries;
    input;

    render(cn, Input, Select) {
        return (
            <div className={ cn }>
                <Input
                    className={ cn('input') }
                    ref={ (input) => { this.input = input; } }
                    { ...this.props }
                    focused={ this.state.inputFocused }
                    leftAddons={
                        <Select
                            className={ cn('select') }
                            disabled={ this.props.disabled }
                            mode='radio'
                            options={ this.prepareOptions(cn) }
                            renderButtonContent={ this.renderSelectButtonContent }
                            size={ this.props.size }
                            value={ [this.state.countryIso2] }
                            onBlur={ this.handleSelectBlur }
                            onChange={ this.handleSelectChange }
                            onFocus={ this.handleSelectFocus }
                        />
                    }
                    mask={ this.state.inputMask }
                    noValidate={ true }
                    placeholder={ this.props.inputPlaceholder }
                    type='tel'
                    value={ this.props.value !== undefined ? this.props.value : this.state.inputValue }
                    onBlur={ this.handleInputBlur }
                    onChange={ this.handleInputChange }
                    onFocus={ this.handleInputFocus }
                />
            </div>
        );
    }

    formatNumber(value) {
        let formatter = new asYouType();
        let number = formatter.input(value);
        let template = formatter.template;

        return number;
    }

    @autobind
    renderSelectButtonContent() {
        return <FlagIcon country={ this.state.countryIso2 } />;
    }

    @autobind
    handleSelectBlur() {
        if (this.input && document.activeElement !== this.input.getControl()) {
            this.setState({ inputFocused: false });
        }
    }

    @autobind
    handleSelectFocus() {
        this.setState({ inputFocused: true });
    }

    @autobind
    handleSelectChange(value) {
        let inputValue = `+${this.countries.find(country => country.iso2 === value[0]).dialCode}`;

        this.setState({
            countryIso2: value[0],
            inputMask: undefined,
            inputValue
        }, () => {
            // Wait for select blur, then focus on input
            setTimeout(() => {
                this.input.focus();
                this.input.setSelectionRange(inputValue.length);
            }, 0);
        });
    }

    @autobind
    handleInputBlur() {
        this.setState({ inputFocused: false });
    }

    @autobind
    handleInputChange(value) {
        // Determine country by first symbols in input
        // Summarize max length by adding 1 for '+' starting symbol
        if (value.length <= MAX_DIAL_CODE_LENGTH + 1) {
            this.countries.forEach((country) => {
                if (new RegExp(`^\\+${country.dialCode}`).test(value)) {
                    this.setState({
                        countryIso2: country.iso2,
                        inputMask: undefined
                    });
                }
            });
        }

        this.formatNumber(value);

        this.setState({
            inputValue: value
        });
    }

    @autobind
    handleInputFocus() {
        this.setState({ inputFocused: true });
    }

    @autobind
    prepareOptions(cn) {
        this.countries = countries.getCountries();

        return this.countries.map(country => ({
            value: country.iso2,
            text: (
                <span>
                    { country.name }
                    <span className={ cn('select-item-code') }>+{ country.dialCode }</span>
                </span>
            ),
            icon: <FlagIcon country={ country.iso2 } />
        }));
    }


    /**
     * Устанавливает фокус на поле ввода.
     *
     * @public
     */
    focus() {
        this.root.focus();
    }

    /**
     * Убирает фокус с поля ввода.
     *
     * @public
     */
    blur() {
        this.root.blur();
    }

    /**
     * Скроллит страницу до поля ввода.
     *
     * @public
     */
    scrollTo() {
        this.root.scrollTo();
    }
}

export default IntlPhoneInput;
