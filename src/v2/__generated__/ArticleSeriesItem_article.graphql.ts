/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArticleSeriesItem_article = {
    readonly href: string | null;
    readonly title: string | null;
    readonly thumbnailTitle: string | null;
    readonly byline: string | null;
    readonly description: string | null;
    readonly publishedAt: string | null;
    readonly thumbnailImage: {
        readonly display: {
            readonly src: string;
            readonly srcSet: string;
        } | null;
    } | null;
    readonly media: {
        readonly duration: string | null;
    } | null;
    readonly " $refType": "ArticleSeriesItem_article";
};
export type ArticleSeriesItem_article$data = ArticleSeriesItem_article;
export type ArticleSeriesItem_article$key = {
    readonly " $data"?: ArticleSeriesItem_article$data;
    readonly " $fragmentRefs": FragmentRefs<"ArticleSeriesItem_article">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArticleSeriesItem_article",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "thumbnailTitle",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "byline",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "format",
          "value": "MMM DD, YYYY"
        }
      ],
      "kind": "ScalarField",
      "name": "publishedAt",
      "storageKey": "publishedAt(format:\"MMM DD, YYYY\")"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "thumbnailImage",
      "plural": false,
      "selections": [
        {
          "alias": "display",
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 580
            },
            {
              "kind": "Literal",
              "name": "width",
              "value": 869
            }
          ],
          "concreteType": "CroppedImageUrl",
          "kind": "LinkedField",
          "name": "cropped",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "src",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "srcSet",
              "storageKey": null
            }
          ],
          "storageKey": "cropped(height:580,width:869)"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ArticleMedia",
      "kind": "LinkedField",
      "name": "media",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "duration",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Article",
  "abstractKey": null
};
(node as any).hash = '9b3e980e91c235489cef08317a09d083';
export default node;
