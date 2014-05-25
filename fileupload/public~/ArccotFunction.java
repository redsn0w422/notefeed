package function;

import function.domains.*;

/**
 * An arccotangent function.
 * 
 * @author Nathan Lindquist 
 * @version 15 March 2013
 */
public class ArccotFunction extends ArctrigFunction
{
    /**
     * Construct a new arccot function with the default inner function x.
     */
    public ArccotFunction()
    {
        super();
    }
    
    /**
     * Construct a new arccot function with the given inner function
     * @param inner the inner function
     */
    public ArccotFunction(Rectangular inner)
    {
        super(inner);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public double _evaluate(double x)
    {
        if (x > 0)
        {
            return Math.atan(1/x);
        }
        else if (Math.abs(x) < Math.pow(10, -10))
        {
            return Math.PI / 2;
        }
        else
        {
            return Math.PI + Math.atan(1/x);
        }
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public double findZero(double left, double right)
    {
        return Double.NaN;
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public Rectangular _differentiate()
    {
        return new ProductFunction(new Constant(-1), new ArctanFunction(getInner()).differentiate());
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public FiniteDomain getDomain(double left, double right)
    {
        return new FiniteDomain(left, right, new Subset(left, right));
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public String _toString()
    {
        return "arccot(x)";
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public boolean _equals(Object o)
    {
        return o instanceof ArccotFunction;
    }
}
