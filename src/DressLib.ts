
/*export class _StyleSheet
{
	private element: HTMLStyleElement;
	private sheet: StyleSheet;
	constructor()
	{
		this.element = document.createElement('style');
		this.element.appendChild( document.createTextNode('') );
		document.head.appendChild( this.element );
		this.sheet = <StyleSheet>this.element.sheet;
	}
}*/

class Dress
{
	public static toLower( c: string ) { return '-' + String.fromCharCode( c.charCodeAt( 0 ) | 32 ); }

	public selector: string;
	private style: { [ key in keyof CSSStyleDeclaration ]?: string };
	private rules: Dress[];
	private element: HTMLStyleElement;

	constructor( selector: string )
	{
		this.selector = selector;
		this.style = {};
		this.rules = [];
	}

	// CSSStyleDeclaration
	public set( name: keyof CSSStyleDeclaration | { [ key in keyof CSSStyleDeclaration ]?: string }, value: string = '' )
	{
		if ( name === 'length' || name === 'parentRule' ) { return this; }
		if ( typeof name === 'string' )
		{
			this.style[ name ] = value;
		} else
		{
			Object.keys( name ).forEach( ( key: keyof CSSStyleDeclaration ) =>
			{
				if ( key === 'length' || key === 'parentRule' ) { return this; }
				this.style[ key ] = name[ key ] || '';
			} );
		}
		return this;
	}

	public unset( ...names: (keyof CSSStyleDeclaration)[] )
	{
		names.forEach( ( name ) => { delete this.style[ name ]; } );
		return this;
	}

	// CSSRule
	public add( style: Dress | string )
	{
		if ( typeof style === 'string' )
		{
			const selectors = style.split( ' ' );
			const selector = selectors.shift() || '';
			let _style = <Dress>this.search( selector );
			if ( !_style )
			{
				_style = new Dress( selector );
				this.rules.push( _style );
			}
			selectors.forEach( ( selector ) =>
			{
				_style = _style.add( selector );
			} );

			return _style;
		}

		for ( let i = 0 ; i < this.rules.length ; ++i )
		{
			if ( this.rules[ i ].selector === style.selector )
			{
				this.rules[ i ] = style;
				// TODO: mearge inSelector
				return style;
			}
		}

		this.rules.push( style );
		return style;
	}

	public search( selector: string )
	{
		for ( let i = 0 ; i < this.rules.length ; ++i )
		{
			if ( this.rules[ i ].selector === selector )
			{
				return this.rules[ i ];
			}
		}
		return null;
	}

	public remove( selector: string )
	{
		for ( let i = 0 ; i < this.rules.length ; ++i )
		{
			if ( this.rules[ i ].selector === selector )
			{
				this.rules.splice( i, 1 );
				// TODO: check this.inSelector[ i ].inSelector
			}
		}
		return this;
	}

	public update( selector: string, name: keyof CSSStyleDeclaration | { [ key in keyof CSSStyleDeclaration ]?: string }, value: string = '' )
	{
		const rule = this.search( selector );
		if ( !rule ) { return null; }
		rule.set( name, value );
		return rule;
	}

	public clear( selector: string )
	{
		const rule = this.search( selector );
		if ( !rule ) { return this; }
		rule.style = {};
		return this;
	}

	public toStoring( selector: string = '' ): string
	{
		if ( selector )
		{
			if ( this.selector[ 0 ] === '&' )
			{
				selector += this.selector.substring( 1 );
			} else
			{
				selector += ' ' + this.selector;
			}
		} else { selector = this.selector; }

		const style = Object.keys( this.style ).map( ( key: keyof CSSStyleDeclaration ) =>
		{
			return key.replace( /[A-Z]/g, Dress.toLower ) + ':' + this.style[ key ];
		} ).join( ';' );
		return ( this.selector && style ? ( selector + '{' + style + '}' ) : '' ) + this.rules.map( ( rule ) => { return rule.toStoring( selector ); } ).join( '' );
	}

	// <style>
	public reflectStyleSheet()
	{
		if ( !this.element )
		{
			this.element = document.createElement( 'style' );
			this.element.appendChild( document.createTextNode( '' ) );
			document.head.appendChild( this.element );
		}
		this.element.textContent = this.toStoring();
		return this.element;
	}
}