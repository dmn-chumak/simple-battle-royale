import { ItemType } from "../../common/data_types/ItemType";
import { Recipe } from "../../common/data_types/Recipe";

export const AVAILABLE_RECIPES: Recipe[] = [
    {
        id: 0,
        ingredients: [
            {
                type: ItemType.Grass,
                amount: 3
            }
        ],
        result: ItemType.Bandage
    },
    {
        id: 1,
        ingredients: [
            {
                type: ItemType.Stick,
                amount: 1
            },
            {
                type: ItemType.Bark,
                amount: 1
            },
            {
                type: ItemType.Grass,
                amount: 2
            }
        ],
        result: ItemType.Helmet
    },
    {
        id: 2,
        ingredients: [
            {
                type: ItemType.Bark,
                amount: 2
            },
            {
                type: ItemType.Grass,
                amount: 2
            }
        ],
        result: ItemType.Armor
    },
    {
        id: 3,
        ingredients: [
            {
                type: ItemType.Stick,
                amount: 2
            },
            {
                type: ItemType.Rock,
                amount: 2
            },
            {
                type: ItemType.Grass,
                amount: 1
            }
        ],
        result: ItemType.Club
    },
    {
        id: 4,
        ingredients: [
            {
                type: ItemType.Stick,
                amount: 1
            },
            {
                type: ItemType.Rock,
                amount: 1
            },
            {
                type: ItemType.Grass,
                amount: 1
            }
        ],
        result: ItemType.Dagger
    },
];