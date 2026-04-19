def format_percentage(value):
    if value is None:
        return "N/A"
    return f"{value * 100:.2f}%"

def format_currency(value):
    if value is None:
        return "N/A"
    return f"${value:,.2f}"
