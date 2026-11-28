import { createElement } from 'react';

import Icon, { type IconName, type IconProps } from '@/components/icon';
import * as RemixIcons from '@remixicon/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Freeze the existing public names independently of the production registry.
const iconNames = [
  'RiSun',
  'RiMoon',
  'RiNotification3',
  'RiUser',
  'RiGroup',
  'RiUserFollow',
  'RiUserUnfollow',
  'RiPencil',
  'RiSearch',
  'RiMapPinUser',
  'RiLinks',
  'RiBookmark',
  'RiBookmark2',
  'RiChat1',
  'RiArrowRightUp',
  'RiArrowRight',
  'RiArrowLeft',
  'RiArrowGoBack',
  'RiArrowGoForward',
  'RiArrowDownS',
  'RiArrowUpS',
  'RiMore',
  'RiLoader5',
  'RiRadioButton',
  'RiClose',
  'RiCompass',
  'RiNewspaper',
  'RiSparkling',
  'RiAdd',
  'RiHashtag',
  'RiSubtract',
  'RiClipboard',
  'RiUpload2',
  'RiDownload2',
  'RiDeleteBin6',
  'RiNavigation',
  'RiSettings3',
  'RiHistory',
  'RiShare',
  'RiShareForward',
  'RiEdit2',
  'RiHeart3',
  'RiThumbUp',
  'RiTrophy',
  'RiQuestion',
  'RiCalendar',
  'RiMail',
  'RiMailOpen',
  'RiCodeSSlash',
  'RiShakeHands',
  'RiCameraLens',
  'RiGithub',
  'RiTwitterX',
  'RiDiscord',
  'RiGoogle',
  'RiMeta',
  'RiWhatsapp',
  'RiYoutube',
  'RiInstagram',
  'RiTelegram2',
  'RiLinkedin',
  'RiInformation',
  'RiCheck',
  'RiCloseCircle',
  'RiResetRight',
  'RiLoginBox',
  'RiLogoutBoxR',
  'RiLock',
  'RiErrorWarning',
  'RiVerifiedBadge',
  'RiEye',
  'RiEyeClose',
  'RiLightbulb',
  'RiMessage3',
  'RiMessage',
  'RiBug',
  'RiMenu2',
  'RiArrowRightS',
  'RiArrowLeftS',
  'RiBookShelf',
  'RiSparkle2',
  'RiTimeline',
  'RiBellLine',
  'RiSettings5Line',
  'RiBard',
  'RiMenu4',
  'RiMenu3',
  'RiCloseLarge',
  'RiMenu',
  'RiDraft',
  'RiTime',
  'RiCoupon3',
  'RiShield',
] as const satisfies readonly IconName[];

const variants = ['Line', 'Fill', 'NIL'] as const;
const cases = iconNames.flatMap((name) =>
  variants.map((type) => ({
    name,
    type,
    exportName: type === 'NIL' ? name : name + type,
  }))
);
const sourcePath = resolve('src/components/icon.tsx');
const source = readFileSync(sourcePath, 'utf8');
const ast = ts.createSourceFile(
  sourcePath,
  source,
  ts.ScriptTarget.Latest,
  true
);

describe('Icon bounded synchronous imports', () => {
  it('retains the existing public name union', () => {
    const declaration = ast.statements.find(
      (node): node is ts.TypeAliasDeclaration =>
        ts.isTypeAliasDeclaration(node) && node.name.text === 'IconName'
    );
    expect(declaration && ts.isUnionTypeNode(declaration.type)).toBe(true);
    const members = (declaration!.type as ts.UnionTypeNode).types.map(
      (node) => ((node as ts.LiteralTypeNode).literal as ts.StringLiteral).text
    );
    expect(Array.from(new Set(members)).sort()).toEqual([...iconNames].sort());
  });

  it('imports only the 179 reachable exports explicitly from the public entry', () => {
    const imports = ast.statements.filter(ts.isImportDeclaration);
    const packImports = imports.filter(
      (node) =>
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text.startsWith('@remixicon/react')
    );
    expect(packImports).toHaveLength(1);
    const declaration = packImports[0];
    expect((declaration.moduleSpecifier as ts.StringLiteral).text).toBe(
      '@remixicon/react'
    );
    expect(declaration.importClause?.name).toBeUndefined();
    const bindings = declaration.importClause?.namedBindings;
    expect(bindings && ts.isNamedImports(bindings)).toBe(true);
    const importedNames = (bindings as ts.NamedImports).elements.map(
      (node) => (node.propertyName ?? node.name).text
    );
    const expectedExports = cases
      .map(({ exportName }) => exportName)
      .filter((name) => Object.hasOwn(RemixIcons, name));
    expect(importedNames).toHaveLength(179);
    expect([...importedNames].sort()).toEqual(expectedExports.sort());

    let dynamicLoads = 0;
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) &&
            node.expression.text === 'require'))
      ) {
        dynamicLoads++;
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
    expect(dynamicLoads).toBe(0);
  });
});

describe('Icon rendering compatibility', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(cases)(
    '$name/$type preserves SVG, size, classes, and missing-export errors',
    ({ name, type, exportName }) => {
      const ExpectedIcon = RemixIcons[exportName as keyof typeof RemixIcons];
      for (const options of [
        {},
        { size: 0, className: '' },
        { size: 37, className: 'h-6 w-6 shrink-0 dark:text-white' },
      ]) {
        vi.mocked(console.error).mockClear();
        const actual = renderToStaticMarkup(
          <Icon name={name} type={type} {...options} />
        );
        if (ExpectedIcon) {
          expect(actual).toBe(
            renderToStaticMarkup(
              createElement(ExpectedIcon, {
                size: options.size ?? 20,
                className: options.className,
              })
            )
          );
          expect(console.error).not.toHaveBeenCalled();
        } else {
          expect(actual).toBe('');
          expect(console.error).toHaveBeenCalledTimes(1);
          expect(console.error).toHaveBeenCalledWith(
            'Icon "' + exportName + '" does not exist in RemixIcons.'
          );
        }
      }
    }
  );

  it.each(iconNames)('%s defaults to Line and size 20', (name) => {
    const ExpectedIcon = RemixIcons[(name + 'Line') as keyof typeof RemixIcons];
    const actual = renderToStaticMarkup(<Icon name={name} />);
    if (ExpectedIcon) {
      expect(actual).toBe(
        renderToStaticMarkup(createElement(ExpectedIcon, { size: 20 }))
      );
      expect(console.error).not.toHaveBeenCalled();
    } else {
      expect(actual).toBe('');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        'Icon "' + name + 'Line" does not exist in RemixIcons.'
      );
    }
  });

  it('applies defaults to explicitly undefined optional props', () => {
    expect(
      renderToStaticMarkup(
        <Icon
          name='RiSun'
          type={undefined}
          size={undefined}
          className={undefined}
        />
      )
    ).toBe(
      renderToStaticMarkup(createElement(RemixIcons.RiSunLine, { size: 20 }))
    );
    expect(console.error).not.toHaveBeenCalled();
  });

  it.each([
    { name: 'RiUnknownIcon', type: 'Line', exportName: 'RiUnknownIconLine' },
    { name: 'RiUnknownIcon', type: 'Fill', exportName: 'RiUnknownIconFill' },
    { name: 'RiUnknownIcon', type: 'NIL', exportName: 'RiUnknownIcon' },
    { name: 'RiSun', type: 'Unknown', exportName: 'RiSunUnknown' },
    { name: 'RiSparkle2', type: 'Line', exportName: 'RiSparkle2Line' },
    { name: 'RiTimeline', type: 'Fill', exportName: 'RiTimelineFill' },
    { name: 'RiBellLine', type: 'Line', exportName: 'RiBellLineLine' },
    {
      name: 'RiSettings5Line',
      type: 'Fill',
      exportName: 'RiSettings5LineFill',
    },
  ])(
    '$exportName returns null with the original error',
    ({ name, type, exportName }) => {
      // Exercise invalid runtime values as well as declared-but-missing exports.
      expect(Icon({ name, type } as IconProps)).toBeNull();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        'Icon "' + exportName + '" does not exist in RemixIcons.'
      );
    }
  );
  it.each([
    'constructor',
    '__proto__',
    'toString',
    'hasOwnProperty',
    'valueOf',
  ])(
    '%s/NIL rejects inherited properties with the original missing-icon error',
    (name) => {
      const props = { name, type: 'NIL' } as IconProps;

      expect(Icon(props)).toBeNull();
      expect(renderToStaticMarkup(<Icon {...props} />)).toBe('');
      const message = 'Icon "' + name + '" does not exist in RemixIcons.';
      expect(vi.mocked(console.error).mock.calls).toEqual([
        [message],
        [message],
      ]);
    }
  );
});
