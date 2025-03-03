<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->isMethod('post')) {
            return [
                'name' => 'required|string|max:255',
                'barcode' => 'required|string|unique:products,barcode',
                'selling_price' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'unit_id' => 'required|exists:units,id',
                'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ];
        } elseif ($this->isMethod('put') || $this->isMethod('patch')) {
            $product = $this->route('product');
            $productId = $product ? $product->id : null;

            return [
                'name' => 'required|string|max:255',
                'barcode' => [
                    'required',
                    'string',
                    Rule::unique('products', 'barcode')->ignore($productId),
                ],
                'selling_price' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'unit_id' => 'required|exists:units,id',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ];
        }

        return [];
    }

}
