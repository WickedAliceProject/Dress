# Dress

## Sample

```
window.addEventListener( 'DOMContentLoaded', () =>
{
	const dress = new Dress();

	// Add Selector.
	// div {}
	const div = dress.add( 'div' );
	// Set style.
	// div { color: blue }
	div.set( { color: 'blue' } );

	// Method chain.
	// .red { color: red }
	dress.add( '.red' ).set( { color: 'red' } );

	// Connect.
	// div.green { color: green; }
	div.add( '&.green' ).set( { color: 'green' } );

	// Deep.
	// div span { font-size: 1.5rem; }
	const span = div.add( 'span' ).set( { fontSize: '1.5rem' } );

	// :before
	// div span:before { content: "*"; display: inline }
	span.add( '&:before' ).set( { content: '"*"', display: 'inline' } );

	// Add CSS to document.head.
	//<style>div{color:blue}div.green{color:green}div span{font-size:1.5rem}div span:before{content:"*";display:inline}.red{color:red}</style>
	dress.reflectStyleSheet( document.head );
} );
```

### Result

```
<head>
<title>test</title>
</head>
```

↓

```
<head>
<style>
div { color:blue }
div.green { color:green }
div span { font-size:1.5rem }
div span:before { content:"*"; display:inline }
.red{color:red}
</style>
<title>test</title>
</head>
```

# Methods

## new Dress( selector?: string )

Create dress.

## set( values: { [ key in keyof CSSStyleDeclaration ]?: string } )

Set styles.

Retrun this.

## set( name: keyof CSSStyleDeclaration, value: string )

Set style.

Retrun this.

## setCustom( name: string | { [ key: string ]: string }, value: string = '' )

Set CSS custom property.

Retrun this.

## unset( ...names: (keyof CSSStyleDeclaration|string)[] )

Retrun this.

## add( selector: string )

Add selector.

Retrun new dress!!!

## add( style: Dress | string )

Add selector.

Retrun new dress!!!

## search( selector: string )

Search has selector.

Return dress or null.

## remove( selector: string )

Remove selector.

Return this.

## update( selector: string, value: { [ key in keyof CSSStyleDeclaration ]?: string } )

Update selector.

Return target dress.

## update( selector: string, name: keyof CSSStyleDeclaration, value: string )

Update selector.

Return target dress.

## clear( selector: string )

Clear selector.

Return this.

## toStoring()

Style to string.

## reflectStyleSheet( rootElement?: HTMLElement | ShadowRoot, force?: boolean )

Add CSS in rootElement( or document.head ).

Return HTMLStyleElement.
