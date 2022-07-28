import { ItemType } from "./ItemType";

export interface RecipeIngredient
{
    type: ItemType;
    amount: number;
}

export interface Recipe
{
    id: number;
    ingredients: RecipeIngredient[];
    result: ItemType;
}